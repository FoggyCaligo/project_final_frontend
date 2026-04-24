"use client";

import { useEffect } from "react";
import { useState } from "react";
import { fridgeApi } from "@/api/fridgeApi";
import PrivateLayout from "@/components/layout/private/PrivateLayout";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Ingredient from "./components/Ingredient.jsx"
import Modal from "@/components/ui/Modal.jsx";



export default function FridgePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fridgeApi()
            .then((res) => console.log("API 성공:", res.data))
            .catch(() => {
                // API 실패는 개발 중 빈 응답일 수 있어 UI 동작을 막지 않도록 처리
            });
    }, []);

    class Ingredient{
        constructor(){
            this.name = "";
            this.expire = new Date();
            this.qty = 0;
        }
        setData(name=null,expire=null,qty=null){
            if(name != null){this.name = name;}
            if(expire != null){this.expire = expire;}
            if(qty != null){this.qty = qty;}
        }
        getData(){
            return {
                name: this.name,
                expire: this.expire,
                qty: this.qty,
            };
        }
    }

    class Fridge{// Ingredients 객체들을 관리하는 컨테이너
        constructor(){
            this.storage = []; 
        }
        add(ingre){//재료 추가 //Ingredient 객체 넣어두기
            // this.ingres[ingre.getData().name] = ingre;
            this.storage.add(ingre);
        }
        getData(){//문자열로 이름 조회 > 해당 재료 객체 가져오기
            return this.storage;
        }
        getEach(ingreName){
            return this.storage[ingreName];
        }
        edit(idx, ingre){
            this.storage[idx] = ingre;
        }
    }



    const fridge = new Fridge();
    

    

    return (
        <PrivateLayout>
            <Section>
                {/*식재료 관리*/}
                <Card>
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-col">
                            <div className="text-lg font-bold">냉장고 현황</div>
                            <div className="my-2 text-sm text-gray-600">현재 냉장고에 있는 재료들을 확인하세요</div>
                        </div>
                        <Button handleClick={() => setIsModalOpen(true)}>식재료 추가</Button>
                    </div>
                    <div className="flex flex-col gap-2">
                        {fridge.getData().map((each,idx) => (
                            <Ingredient key={each}
                                name={each.getData().name} description="식재료 메모" expires={each.getData().expire} qty={each.getData().qty} 
                                handleClickDelete={() => alert("재료 삭제")} 
                                handleClickEdit={() => {
                                    setIsModalOpen(true);
                                }} 
                            />
                        ))}

                    </div>
                </Card>

                {/*식재료 추가/수정 모달*/}
                <Modal title="재료 추가" 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}>
                    <TextInput placeholder="재료 이름" getText={(text) => {} } />
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

