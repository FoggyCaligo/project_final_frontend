"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { fridgeApi } from "@/api/fridgeApi";
import PrivateLayout from "@/components/layout/private/PrivateLayout";
import InputText from "@/components/ui/InputText.jsx";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import InputDate from "@/components/ui/InputDate.jsx";
import Modal from "@/components/ui/Modal.jsx";
import Recipe from "@/components/ui/Recipe.jsx";
import TestImg from "@/assets/test_img.jpg";
import Tag from "@/components/ui/Tag.jsx"
import Title from "@/components/ui/Title.jsx";
import SubTitle from "@/components/ui/SubTitle.jsx";
import Select from "@/components/ui/Select.jsx";
import IngredientComponent from "./components/Ingredient.jsx"



// 모달 모드: 0: 닫힘, 1: 수정, 2: 추가
const ModalModes = {close: 0, edit: 1, add: 2};
//식재료 보관 형식
const StorageType = {
    REFRIGERATED: "REFRIGERATED",
    FROZEN: "FROZEN",
    ROOM_TEMP: "ROOM_TEMP",
    UNKNOWN: "UNKNOWN",
};
const StorageType2Kor = {
    REFRIGERATED: "냉장",
    FROZEN: "냉동",
    ROOM_TEMP: "실온",
    UNKNOWN: '알 수 없음',
}
    
// 1. 식재료 데이터 모델 (프론트 로컬 상태)
// 백엔드 DTO 매핑: id→ingredientId, name→name, expire→expirationDate, qty→quantity
class Ingredient {
    constructor(id = null, name = "", expire = null, qty = 0, storageType = StorageType.UNKNOWN, freshnessStatus = null) {
        this.id = id;             // 백엔드 ingredientId
        this.name = name;         // 백엔드 name
        this.expire = expire;     // 백엔드 expirationDate (YYYY-MM-DD)
        this.qty = qty;           // 백엔드 quantity
        this.storageType = storageType;
        this.freshnessStatus = freshnessStatus;
    }

    cloneWith(fields) {
        const next = new Ingredient(this.id, this.name, this.expire, this.qty, this.storageType, this.freshnessStatus);
        Object.assign(next, fields);
        return next;
    }
}

// 백엔드 응답 항목(IngredientResponse) → 프론트 Ingredient 객체 변환
function fromApiItem(item) {
    return new Ingredient(
        item.ingredientId,
        item.name,
        item.expirationDate,
        item.quantity,
        item.storageType ?? StorageType.UNKNOWN,
        item.freshnessStatus ?? null
    );
}

// 프론트 Ingredient → 백엔드 요청 DTO(CreateIngredientRequest / UpdateIngredientRequest) 변환
function toApiDto(ingredient) {
    return {
        name: ingredient.name,
        expirationDate: ingredient.expire,
        quantity: Number(ingredient.qty),
        storageType: ingredient.storageType,
    };
}

// 2. 이미지 스캐너 데이터 모델
class ImageScanner {
    constructor(file = null, previewUrl = null, results = []) {
        this.file = file;
        this.previewUrl = previewUrl;
        this.results = results;
    }

    cloneWith(fields) {
        const next = new ImageScanner(this.file, this.previewUrl, this.results);
        Object.assign(next, fields);
        return next;
    }

    reset() {
        return new ImageScanner();
    }
}

export default function FridgePage() {
    const [modalMode, setModalMode] = useState(0);
    const [editIdx, setEditIdx] = useState(null); // 수정 중인 인덱스 저장
    
    const fileInputRef = useRef(null);
    
    const [storage, setStorage] = useState([]);
    const [summary, setSummary] = useState(null);
    const [currentIngredient, setCurrentIngredient] = useState(new Ingredient());
    const [scanner, setScanner] = useState(new ImageScanner());

    

    const RecipeList = getRecipeList();

    // 초기 로드: 백엔드에서 식재료 목록 + 요약 조회
    const fetchIngredients = useCallback(async () => {
        try {
            const res = await fridgeApi.getIngredients();
            const items = res.data?.data?.items ?? [];
            setStorage(items.map(fromApiItem));
        } catch (err) {
            console.error("식재료 목록 조회 실패:", err);
        }
    }, []);

    const fetchSummary = useCallback(async () => {
        try {
            const res = await fridgeApi.getSummary();
            setSummary(res.data?.data ?? null);
        } catch (err) {
            console.error("냉장고 요약 조회 실패:", err);
        }
    }, []);

    useEffect(() => {
        fetchIngredients();
        fetchSummary();
    }, [fetchIngredients, fetchSummary]);

    // 이미지 파일 변경 시 미리보기 생성
    useEffect(() => {
        if (!scanner.file) {
            setScanner(prev => prev.cloneWith({ previewUrl: null, results: [] }));
            return;
        }
        const url = URL.createObjectURL(scanner.file);
        setScanner(prev => prev.cloneWith({
            previewUrl: url,
            results: ['사과', '복숭아', '자두']
        }));
        return () => URL.revokeObjectURL(url);
    }, [scanner.file]);

    const updateField = (field, value) => {
        setCurrentIngredient(prev => prev.cloneWith({ [field]: value }));
    };

    function onSelectImgScanResult(selected) {
        setScanner(prev => prev.reset());
        updateField('name', selected);
    }

    const handleConfirm = async () => {
        try {
            const dto = toApiDto(currentIngredient);
            if (modalMode === ModalModes.add) {
                await fridgeApi.addIngredient(dto);
            } else if (modalMode === ModalModes.edit && editIdx !== null) {
                await fridgeApi.updateIngredient(currentIngredient.id, dto);
            }
            await fetchIngredients();
            await fetchSummary();
        } catch (err) {
            console.error("식재료 저장 실패:", err);
        }
        setModalMode(ModalModes.close);
    };

    const handleClickDelete = async (ingredient) => {
        try {
            await fridgeApi.deleteIngredient(ingredient.id);
            await fetchIngredients();
            await fetchSummary();
        } catch (err) {
            console.error("식재료 삭제 실패:", err);
        }
    };

    function getRecipeList() {
        const url = TestImg.src || TestImg; // static import된 이미지는 이미 URL 정보를 가지고 있습니다.
        return ([
            {
                name: "레시피 1",
                time: "30분",
                difficulty: "쉬움",
                imageURL: url,
            },
            {
                name: "레시피 1",
                time: "30분",
                difficulty: "쉬움",
                imageURL: url,
            },
            {
                name: "레시피 1",
                time: "30분",
                difficulty: "쉬움",
                imageURL: url,
            }
        ]);
    }

    // 보관 장소 타입별로 카드를 생성하기 위한 배열 정의
    const storageCategories = Object.keys(StorageType).map(typeKey => ({
        type: StorageType[typeKey], // 예: StorageType.REFRIGERATED
        title: StorageType2Kor[typeKey], // 예: "냉장"
    }));

    return (
        <PrivateLayout>
            <Section>
                {/* 냉장고 현황 카드 (모든 재료 표시) */}
                <Card style={{ backgroundColor: "var(--border)" }}>
                    <div className="flex flex-row justify-between items-center mb-4">
                        <div className="flex flex-col">
                            <Title>냉장고 현황</Title>
                            <SubTitle>현재 냉장고에 있는 재료들을 확인하세요</SubTitle>
                        </div>
                        <Button handleClick={() => {
                            setCurrentIngredient(new Ingredient());
                            setScanner(new ImageScanner());
                            setModalMode(ModalModes.add);
                        }}>식재료 추가</Button>
                    </div>
                    {/* 신선도 요약 통계 (규정: 신선도규칙_확정표_초안.md §요약집계) */}
                    {summary && (
                        <div className="flex flex-row gap-4 mb-4 text-sm">
                            <span>전체 <strong>{summary.totalCount}</strong></span>
                            <span className="text-green-600">신선 <strong>{summary.freshCount}</strong></span>
                            <span className="text-orange-500">임박 <strong>{summary.soonCount}</strong></span>
                            <span className="text-red-500">만료 <strong>{summary.expiredCount}</strong></span>
                        </div>
                    )}
                    <div className="flex flex-col gap-2">
                        {storage.map((each, idx) => (
                            <IngredientComponent
                                key={each.id ?? idx}
                                name={each.name}
                                description="식재료 메모"
                                expires={each.expire}
                                qty={each.qty}
                                storageType={StorageType2Kor[each.storageType]}
                                freshnessStatus={each.freshnessStatus}
                                handleClickDelete={() => handleClickDelete(each)}
                                handleClickEdit={() => {
                                    setCurrentIngredient(each);
                                    setScanner(new ImageScanner());
                                    setEditIdx(idx);
                                    setModalMode(ModalModes.edit);
                                }}
                            />
                        ))}
                    </div>
                </Card>

                {/* 보관 장소 타입별 재료 표시 (반복문 사용) */}
                {storageCategories.map((category) => (
                    <Card key={category.type}>
                        <div className="flex flex-col mb-4">
                            <Title>{category.title}</Title>
                            <SubTitle>현재 냉장고에 있는 재료들 중 {category.title} 으로 분류된 재료들 입니다.</SubTitle>
                        </div>
                        <div className="flex flex-col gap-2">
                            {storage
                                .filter(each => each.storageType === category.type)
                                .map((each, idx) => (
                                    <IngredientComponent
                                        key={each.id ?? idx}
                                        name={each.name}
                                        description="식재료 메모"
                                        expires={each.expire}
                                        qty={each.qty}
                                        storageType={StorageType2Kor[each.storageType]}
                                        freshnessStatus={each.freshnessStatus}
                                        handleClickDelete={() => handleClickDelete(each)}
                                        handleClickEdit={() => {
                                            setCurrentIngredient(each);
                                            setScanner(new ImageScanner());
                                            setEditIdx(storage.indexOf(each));
                                            setModalMode(ModalModes.edit);
                                        }}
                                    />
                                ))
                            }
                        </div>
                    </Card>
                ))}

                {/* 추천 레시피 카드 */}
                <Card>
                    <div className="text-lg font-bold mb-6">추천 레시피</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {RecipeList.map((each, idx) => (
                            <Recipe
                                key={idx}
                                name={each.name}
                                time={each.time}
                                difficulty={each.difficulty}
                                imageURL={each.imageURL}
                            />
                        ))}
                    </div>
                </Card>

                {/* Modal 컴포넌트는 변경 없음 */}
                <Modal
                    title={modalMode === ModalModes.add ? "재료 추가" : "재료 수정"}
                    isOpen={modalMode !== ModalModes.close}
                    onClose={() => setModalMode(ModalModes.close)}
                    onConfirm={handleConfirm}
                    confirmText={modalMode === ModalModes.add ? "추가" : "수정"}>
                    <div className="flex flex-col gap-4">
                        {scanner.previewUrl ? (
                            <div className="w-full overflow-hidden rounded-2xl relative bg-gray-100 flex flex-col">
                                <div className="w-full h-48 relative">
                                    <img src={scanner.previewUrl} alt="preview" className="w-full h-full object-contain" />
                                    <button
                                        type="button"
                                        onClick={() => setScanner(prev => prev.reset())}
                                        className="absolute top-2 right-2 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center"
                                    >×</button>
                                </div>
                                <div className="flex flex-row w-full p-2 gap-2 bg-white/80 border-t">
                                    {scanner.results.map((result, idx) => (
                                        <Button key={idx} is_full="true" variant="primary" size="sm" handleClick={() => onSelectImgScanResult(result)}>
                                            {result}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-row gap-2 items-end">
                                <InputText
                                    is_full="true"
                                    placeholder="재료 이름"
                                    setText={currentIngredient.name}
                                    getText={(val) => updateField('name', val)}
                                />
                                <Button is_square="true" is_full="true" variant="accent" handleClick={() => fileInputRef.current?.click()}>
                                    이미지 인식
                                </Button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) setScanner(prev => prev.cloneWith({ file }));
                                    }}
                                />
                            </div>
                        )}
                        <InputDate
                            placeholder="유통기한"
                            setText={currentIngredient.expire}
                            getText={(val) => updateField('expire', val)}
                        />
                        <Select
                            placeholder="보관 장소 선택"
                            options={Object.entries(StorageType2Kor).map(([key, label]) => ({
                                label: label,
                                value: key
                            }))}
                            setText={currentIngredient.storageType}
                            getText={(val) => updateField('storageType', val)}
                            is_full="true"
                        />
                        <InputText
                            placeholder="수량"
                            setText={currentIngredient.qty}
                            getText={(val) => updateField('qty', val)}
                        />

                    </div>
                </Modal>
            </Section>
        </PrivateLayout>
    );
}
