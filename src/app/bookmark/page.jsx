"use client";

import { useEffect } from "react";
import PrivateLayout from "@/components/layout/private/PrivateLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Recipe from "@/components/ui/Recipe";
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

            </Section>
        </PrivateLayout>
    );
}