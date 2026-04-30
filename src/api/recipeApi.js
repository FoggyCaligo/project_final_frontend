import api from "@/config/axios";

export const getAllRecipes = async () => {
    const response = await api.get("/recipes");
    return response.data.data.content;
};

export const getRecipeDetail = async (id) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
};