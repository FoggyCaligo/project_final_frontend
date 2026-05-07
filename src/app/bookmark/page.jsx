"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMeApi } from "@/api/authApi";
import { getBookmarkedRecipes } from "@/api/bookmarkApi";
import PrivateLayout from "@/components/layout/private/PrivateLayout";
import Recipe from "@/components/ui/Recipe";
import Section from "@/components/ui/Section";
import Loading from "@/components/ui/Loading";

const toArray = (value) => {
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.content)) return value.content;
    if (Array.isArray(value?.items)) return value.items;
    if (Array.isArray(value?.data)) return value.data;
    return [];
};

const normalizeBookmarkRecipe = (item = {}) => {
    const recipe = item?.recipe ?? item;

    return {
        recipeId: recipe?.recipeId ?? recipe?.id ?? item?.recipeId ?? item?.id,
        title: recipe?.title ?? recipe?.name ?? recipe?.recipeName ?? item?.recipeName ?? "레시피",
        cookTimeText: recipe?.cookTimeText ?? recipe?.cookTime ?? recipe?.time ?? "정보 없음",
        difficultyLevel: recipe?.difficultyLevel ?? recipe?.difficulty ?? "정보 없음",
        thumbnailUrl: recipe?.thumbnailUrl ?? recipe?.thumbnail_url ?? recipe?.imageURL ?? recipe?.imageUrl ?? item?.thumbnailUrl ?? null,
    };
};

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
                    return;
                }

                const recipes = await getBookmarkedRecipes(userId);
                const normalizedRecipes = toArray(recipes)
                    .map(normalizeBookmarkRecipe)
                    .filter((recipe) => Boolean(recipe.recipeId));

                setBookmarkedRecipes(normalizedRecipes);
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
                            time={recipe.cookTimeText}
                            difficulty={recipe.difficultyLevel}
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
