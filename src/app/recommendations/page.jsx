"use client";

import { useEffect, useState } from "react";
import PrivateLayout from "@/components/layout/private/PrivateLayout";
import Section from "@/components/ui/Section";
import RecommendationCard from "./components/RecommendationCard";
import { getRecommendations } from "@/api/recommendApi";

export default function RecommendationsPage() {

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const data = await getRecommendations();
                setRecipes(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);
    if (loading) {
        return <PrivateLayout><Section>추천 불러오는 중...</Section></PrivateLayout>
    }

    if (!recipes.length) {
        return <PrivateLayout><Section>추천 결과가 없습니다.</Section></PrivateLayout>
    }
    return (
        <PrivateLayout>
            <Section>
                <div className="grid gap-4">
                    {recipes.map(recipe => (
                        <RecommendationCard
                            key={recipe.recipeId}
                            recipe={recipe}
                        />
                    ))}
                </div>
            </Section>
        </PrivateLayout>
    )
}