"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMeApi } from "@/api/authApi";
import { getBookmarkedRecipes } from "@/api/bookmarkApi";
import PrivateLayout from "@/components/layout/private/PrivateLayout";
import Recipe from "@/components/ui/Recipe";
import Section from "@/components/ui/Section";

export default function BookMark() {
    const router = useRouter();
    const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookmarkedRecipes = async () => {
            try {
                const me = await getMeApi();
                const recipes = await getBookmarkedRecipes(me.data.data.loginId);
                setBookmarkedRecipes(recipes || []);
            } catch (err) {
                console.error("API 에러:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarkedRecipes();
    }, []);

    if (loading) {
        return (
            <PrivateLayout>
                <Section>북마크 레시피 불러오는 중...</Section>
            </PrivateLayout>
        );
    }

    if (!bookmarkedRecipes.length) {
        return (
            <PrivateLayout>
                <Section>북마크한 레시피가 없습니다.</Section>
            </PrivateLayout>
        );
    }

    return (
        <PrivateLayout>
            <Section>
                <div className="grid md:grid-cols-3 gap-6">
                    {bookmarkedRecipes.map((recipe) => (
                        <Recipe
                            key={recipe.recipeId}
                            name={recipe.title}
                            time={recipe.cookTimeText || "정보 없음"}
                            difficulty={recipe.summary || "정보 없음"}
                            imageURL={recipe.thumbnailUrl}
                            handleClick={() => router.push(`/recipes/${recipe.recipeId}`)}
                        />
                    ))}
                </div>
            </Section>
        </PrivateLayout>
    );
}
