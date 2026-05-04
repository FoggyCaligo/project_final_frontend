import api from "@/config/axios";

const toRecipeList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.content)) return payload.content;
    if (Array.isArray(payload?.items)) return payload.items;
    return [];
};

export const getAllRecipes = async () => {
    const response = await api.get("/recipes");
    return toRecipeList(response.data?.data ?? response.data);
};

export const getRecipeDetail = async (id) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data?.data ?? response.data;
};
