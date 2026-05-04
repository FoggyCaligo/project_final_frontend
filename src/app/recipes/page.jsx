"use client";

import { useEffect, useState } from "react";
import { getAllRecipes } from "@/api/recipeApi";
import PrivateLayout from "@/components/layout/private/PrivateLayout";
import Section from "@/components/ui/Section";
import Recipe from "@/components/ui/Recipe";
import { useRouter } from "next/navigation";
import Pagination from "@/components/ui/Pagination";

export default function RecipesPage() {
    const router = useRouter();
    const [recipes, setRecipes] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const result = await getAllRecipes(page, 12);
                setRecipes(result.content);
                setTotalPages(result.pageInfo.totalPages);
                console.log(result);
            } catch (e) {
                console.error(e);
            }
        };

        fetchRecipes();
    }, [page]);

    return (
        <PrivateLayout>
            <Section>
                <div className="grid md:grid-cols-3 gap-6">
                    {recipes.map(recipe => (
                        <Recipe
                            key={recipe.recipeId}
                            name={recipe.title}
                            time={recipe.cookTimeText}
                            difficulty={recipe.summary}
                            handleClick={() =>
                                router.push(`/recipes/${recipe.recipeId}`)
                            }
                            imageURL={recipe.thumbnailUrl}
                        />
                    ))}
                </div>
                <Pagination
                    page={page + 1}
                    totalPages={totalPages}
                    onPageChange={(p) => setPage(p - 1)}
                />
            </Section>
        </PrivateLayout>
    )
}