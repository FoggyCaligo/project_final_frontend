"use client";

import { useEffect } from "react";
import { useState } from "react";
import { fridgeApi } from "@/api/fridgeApi";
import PrivateLayout from "@/components/layout/private/PrivateLayout";
import PublicLayout from "@/components/layout/public/PublicLayout";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Ingredient from "./components/Ingredient.jsx"
import Modal from "@/components/ui/Modal.jsx";



export default function FridgePage() {
    useEffect(() => {
        fridgeApi()
            .then((res) => console.log("API 성공:", res.data))
            .catch((err) =>
                console.error("API 에러:", {
                    message: err?.message,
                    status: err?.status,
                    data: err?.data,
                })
            );
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
            }
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



    class IngreModal{//재료 수정하는 모달
        constructor(){
            this.states= {close:0, add:1, edit:2};
            this.stateIdx = this.states.close;
            this.ingreIdx = 0;
            this.ingre = new Ingredient();
        }
        toggle(stateIdx, ingreIdx=0){
            this.stateIdx = stateIdx;
            this.ingreIdx = ingreIdx;

            alert(this.stateIdx !== this.states.close)
        }
        setData(ingreName, ingreExpire, ingreQty){
            this.ingre.setData(ingreName,ingreExpire, ingreQty)
        }
        close(){
            return this.ingre;
        }
    }

    
    const fridge = new Fridge();
    const ingreModal = new IngreModal();
    

    

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
                        <Button handleClick={()=>{ingreModal.toggle(ingreModal.states.add)}}>식재료 추가</Button>
                    </div>
                    <div className="flex flex-col gap-2">
                        {fridge.getData().map((each,idx) => (
                            <Ingredient key={each}
                                name={each.getData().name} description="식재료 메모" expires={each.getData().expire} qty={each.getData().qty} 
                                handleClickDelete={() => alert("재료 삭제")} 
                                handleClickEdit={() => {
                                    ingreModal.setData(each);
                                    ingreModal.toggle(ingreModal.states.edit);
                                }} 
                            />
                        ))}

                    </div>
                </Card>



                {/*식재료 추가/수정 모달*/}
                <Modal title="재료 추가" 
                    isOpen={ingreModal.stateIdx !== ingreModal.states.close} 
                    onClose={() => {
                        if(ingreModal.stateIdx === ingreModal.states.add){
                            fridge.add(ingreModal.ingre);
                        }
                        else if(ingreModal.stateIdx === ingreModal.states.edit){
                            fridge.edit(ingreModal.ingreIdx, ingreModal.ingre);
                        }
                        IngreModal.toggle(false);
                    }}>
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

