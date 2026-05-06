"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMeApi } from "@/api/authApi";
import { getBookmarkedRecipes } from "@/api/bookmarkApi";
import PrivateLayout from "@/components/layout/private/PrivateLayout";
import Recipe from "@/components/ui/Recipe";
import Section from "@/components/ui/Section";
import Loading from "@/components/ui/Loading";

export default function BookMark() {
    const router = useRouter();
    const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookmarkedRecipes = async () => {
            try {
                const me = await getMeApi();
                const userId = me?.userId;

                if (!userId) {
                    setBookmarkedRecipes([]);
                    console.log("no userId");
                    return;
                }

                const recipes = await getBookmarkedRecipes(userId);
                console.log("recipes",recipes);
                setBookmarkedRecipes(recipes || []);
            } catch (err) {
                console.error("API 에러:", err);
                setBookmarkedRecipes([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarkedRecipes();
    }, []);

    if (loading) {
        return (
            <PrivateLayout>
                <Section />
                <Loading isOpen={true} text="북마크 레시피 불러오는 중..." />
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
                            recipeId={recipe.recipeId}
                            name={recipe.title}
                            time={recipe.cookTimeText || "정보 없음"}
                            difficulty={recipe.difficultyLevel || "정보 없음"}
                            
                            imageURL={recipe.thumbnailUrl}
                            onBookmarkToggle={(nextBookmarked) => {
                                if (!nextBookmarked) {
                                    setBookmarkedRecipes((prev) =>
                                        prev.filter((each) => each.recipeId !== recipe.recipeId)
                                    );
                                }
                            }}
                            handleClick={() => router.push(`/recipes/${recipe.recipeId}`)}
                        />
                    ))}
                </div>
            </Section>
        </PrivateLayout>
    );
}
