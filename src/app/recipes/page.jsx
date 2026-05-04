"use client";

import { useEffect, useState } from "react";
import { getAllRecipes } from "@/api/recipeApi";
import PrivateLayout from "@/components/layout/private/PrivateLayout";
import Section from "@/components/ui/Section";
import Recipe from "@/components/ui/Recipe";
import { useRouter } from "next/navigation";

export default function RecipesPage() {
    const router = useRouter();
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            const data = await getAllRecipes();
            setRecipes(data);
        };

        fetchRecipes();
    }, []);

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
            </Section>
        </PrivateLayout>
    )
}