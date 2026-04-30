import api from "@/config/axios";

export const getAllRecipes = async () => {
    const response = await api.get("/v1/recipes");
    return response.data.data;
};

export const getRecipeDetail = async (id) => {
    const response = await api.get(`/v1/recipes/${id}`);
    return response.data;
};
