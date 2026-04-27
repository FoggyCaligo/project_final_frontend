"use client";

import { useEffect, useState, useRef } from "react";
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
    
// 1. 식재료 데이터 모델
class Ingredient {
    constructor(name = "", expire = null, qty = 0, storageType=StorageType.UNKNOWN) {
        this.name = name;
        this.expire = expire;
        this.qty = qty;
        this.storageType = storageType;
    }

    cloneWith(fields) {
        const next = new Ingredient(this.name, this.expire, this.qty, this.storageType);
        Object.assign(next, fields);
        return next;
    }
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
    const [currentIngredient, setCurrentIngredient] = useState(new Ingredient());
    const [scanner, setScanner] = useState(new ImageScanner());

    

    const RecipeList = getRecipeList();
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

    const handleConfirm = () => {
        if (modalMode === ModalModes.add) {
            // 추가 모드
            setStorage(prev => [...prev, currentIngredient]);
        } else if (modalMode === ModalModes.edit && editIdx !== null) {
            // 수정 모드
            setStorage(prev => {
                const next = [...prev];
                next[editIdx] = currentIngredient;
                return next;
            });
        }
        setModalMode(ModalModes.close);
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
                            setModalMode(ModalModes.add); // 추가 모드
                        }}>식재료 추가</Button>
                    </div>
                    <div className="flex flex-col gap-2">
                        {/* 모든 재료 표시 */}
                        {storage.map((each, idx) => (
                            <IngredientComponent
                                key={idx}
                                name={each.name}
                                description="식재료 메모"
                                expires={each.expire}
                                qty={each.qty}
                                storageType={StorageType2Kor[each.storageType]}
                                handleClickDelete={() => {
                                    setStorage(prev => prev.filter((_, i) => i !== idx));
                                }}
                                handleClickEdit={() => {
                                    setCurrentIngredient(each); // 기존 데이터 로드
                                    setScanner(new ImageScanner()); // 스캐너 초기화
                                    setEditIdx(idx); // 인덱스 저장
                                    setModalMode(ModalModes.edit); // 수정 모드
                                }}
                            />
                        ))}
                    </div>
                </Card>

                {/* 보관 장소 타입별 재료 표시 (반복문 사용) */}
                {storageCategories.map((category) => (
                    <Card key={category.type}>
                        <div className="flex flex-col">
                            <Title>{category.title} </Title>
                            <SubTitle>현재 냉장고에 있는 재료들 중 {category.title} 으로 분류된 재료들 입니다.</SubTitle>
                        </div>
                        <div className="flex flex-col gap-2">
                            {storage
                                .filter(each => each.storageType === category.type)
                                .map((each, idx) => (
                                    <IngredientComponent
                                        key={idx} // 주의: storage 데이터에 고유 ID가 있다면 idx 대신 사용하는 것이 좋습니다.
                                        name={each.name}
                                        description="식재료 메모"
                                        expires={each.expire}
                                        qty={each.qty}
                                        storageType={StorageType2Kor[each.storageType]}
                                        handleClickDelete={() => {
                                            setStorage(prev => prev.filter((_, i) => i !== idx));
                                        }}
                                        handleClickEdit={() => {
                                            setCurrentIngredient(each); // 기존 데이터 로드
                                            setScanner(new ImageScanner()); // 스캐너 초기화
                                            setEditIdx(idx); // 인덱스 저장
                                            setModalMode(ModalModes.edit); // 수정 모드
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
