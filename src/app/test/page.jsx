"use client";

import { useEffect } from "react";
import PrivateLayout from "@/components/layout/private/PrivateLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import { testApi } from "@/api/testApi";

export default function TestPage() {
    useEffect(() => {
        testApi()
            .then((res) => console.log("API 성공:", res.data))
            .catch((err) => console.error("API 에러:", err));
    }, []);

    return (
        <PrivateLayout>
            <Section>
                <div className="flex gap-4">
                    <Button>기본 버튼</Button>
                    <Button variant="secondary">보조 버튼</Button>
                    <Button variant="accent">포인트 버튼</Button>
                </div>
            </Section>

            <Section>
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>상추, 토마토, 달걀</Card>
                    <Card>오늘의 추천 레시피</Card>
                    <Card>부족 재료 확인</Card>
                </div>
            </Section>
        </PrivateLayout>
    );
}