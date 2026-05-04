"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PrivateLayout from "@/components/layout/private/PrivateLayout";
import Section from "@/components/ui/Section";
import Recipe from "@/components/ui/Recipe";
import { getRecommendations } from "@/api/recommendApi";

export default function RecommendationsPage() {
    const router = useRouter();

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
        return (
            <PrivateLayout>
                <Section>추천 불러오는 중...</Section>
            </PrivateLayout>
        );
    }

    if (!recipes.length) {
        return (
            <PrivateLayout>
                <Section>추천 결과가 없습니다.</Section>
            </PrivateLayout>
        );
    }

    return (
        <PrivateLayout>
            <Section>
                <div className="grid gap-4 md:grid-cols-3">
                    {recipes.map((recipe) => (
                        <Recipe
                            key={recipe.recipeId}
                            name={recipe.title}
                            time={recipe.cookTimeText || "정보 없음"}
                            difficulty={recipe.summary || "보통"}
                            imageURL={recipe.thumbnailUrl}
                            variant="recommend"
                            matchRate={recipe.matchRate}
                            reason={recipe.reason}
                            conditionTags={recipe.conditionTags}
                            missingIngredients={recipe.missingIngredients}
                            substituteSuggestions={recipe.substituteSuggestions}
                            warnings={recipe.warnings}
                            handleClick={() => router.push(`/recipes/${recipe.recipeId}`)}
                        />
                    ))}
                </div>
            </Section>
        </PrivateLayout>
    );
}