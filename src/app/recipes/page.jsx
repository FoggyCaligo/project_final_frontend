"use client";

import { useEffect, useState } from "react";
import { getAllRecipes } from "@/api/recipeApi";
import PrivateLayout from "@/components/layout/private/PrivateLayout";
import Section from "@/components/ui/Section";
import Recipe from "@/components/ui/Recipe";

export default function RecipesPage() {

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
                            time={recipe.cookTime}
                            difficulty={recipe.difficulty}
                        />
                    ))}
                </div>
            </Section>
        </PrivateLayout>
    )
}