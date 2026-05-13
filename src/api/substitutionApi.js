import api from "@/config/axios";

export const getSubstitutionSuggestions = async (
    recipeId,
    ownedIngredients = []
) => {
    const response = await api.post(
        "/v1/substitutions/suggest",
        {
            recipeId,
            ownedIngredients,
        }
    );

    return response.data.data;
};

export const getSubstitutePrices = async (
    ingredientNames = []
) => {
    const response = await api.post(
        "/v1/shopping/substitutes/prices",
        ingredientNames
    );

    return response.data.data;
};