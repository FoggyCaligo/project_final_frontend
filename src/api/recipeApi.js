import api from "@/config/axios";

export const getAllRecipes = async (page = 0, size = 12, cookingType = "ALL", sort = "default") => {
    const response = await api.get("/recipes", {
        params: { page, size, cookingType, sort },
    });

    return response.data.data;
    // PageResult 전체 반환: content, totalPages, totalElements 등
};

export const getRecipeDetail = async (id) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
};