import api from "@/config/axios";

const toRecipeList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.content)) return payload.content;
    if (Array.isArray(payload?.items)) return payload.items;
    return [];
};

export const getAllRecipes = async () => {
    const response = await api.get("/v1/recipes");
    return toRecipeList(response.data?.data ?? response.data);
export const getAllRecipes = async (page = 0, size = 12, cookingType = "ALL", sort = "default") => {
    const response = await api.get("/recipes", {
        params: { page, size, cookingType, sort },
    });

    return response.data.data;
    // PageResult 전체 반환: content, totalPages, totalElements 등
};

export const getRecipeDetail = async (id) => {
    const response = await api.get(`/v1/recipes/${id}`);
    return response.data?.data ?? response.data;
};
