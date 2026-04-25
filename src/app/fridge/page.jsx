"use client";

import { useEffect } from "react";
import PrivateLayout from "@/components/layout/private/PrivateLayout";
import PublicLayout from "@/components/layout/public/PublicLayout";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Ingredient from "./components/Ingredient.jsx"
import { fridgeApi } from "@/api/fridgeApi";
import Modal from "@/components/ui/Modal.jsx";
import { useState } from "react";

export default function FridgePage() {
    useEffect(() => {
        fridgeApi()
            .then((res) => console.log("API 성공:", res.data))
            .catch((err) => console.error("API 에러:", err));
    }, []);

    var IngreModal = {
        isOpen: false,
        toggle: (value) => isOpen = value,
        stateEnum: object.freeze({
            add: 'Add',
            edit: 'Edit',
        }),
        state: stateEnum.add,
        setState: (value) => state=value,
        IngreName: "",
        IngreExpire: new Date(),
        IngreQty: 0,
        setIngreExpire: (date) => {
            const expire = new Date(); {/**오늘 날짜로 초기화 */}
            expire.setDate(expire.getDate() + date);{/**date일 후로 초기화 */}
            IngreExpire = expire;
        },
    }

    return (
        <PrivateLayout>
            <Section>
                {/*식재료 관리*/}
                <Card>
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-col">
                            <div className="text-lg font-bold">냉장고 현황</div>
                            <div className="my-2 text-sm text-gray-600">현재 냉장고에 있는 재료들을 확인하세요.</div>
                        </div>
                        <Button handleClick={()=>{IngreModal.toggle(true); IngreModal.setState(IngreModal.add)}}>식재료 추가</Button>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Ingredient name="상추" description="신선한 상추" expires="2023-12-31" qty="5" handleClickDelete={() => alert("재료 삭제")} handleClickEdit={() => setIsModalOpen(true)} />
                        <Ingredient name="토마토" description="달콤한 토마토" expires="2023-11-30" qty="3" handleClickDelete={() => alert("재료 삭제")} handleClickEdit={() => setIsModalOpen(true)} />
                        <Ingredient name="달걀" description="신선한 달걀" expires="2024-01-15" qty="12" handleClickDelete={() => alert("재료 삭제")} handleClickEdit={() => setIsModalOpen(true)} />
                    </div>
                </Card>



                {/*식재료 추가/수정 모달*/}
                <Modal title="재료 추가" isOpen={IngreModal.isOpen} onClose={() => IngreModal.toggle(false) }>
                    <TextInput placeholder="재료 이름" getText={(text) => {IngreModal.IngreName = text} } />
                    <TextInput placeholder="유통기한" getText={(text) => console.log("유통기한:", text)} />
                    <TextInput placeholder="수량" getText={(text) => console.log("수량:", text)} />
                    <Button variant="primary" handleClick={() => alert("재료 추가")}>
                        추가
                    </Button>
                </Modal>
            </Section>                
        </PrivateLayout>
    );
}