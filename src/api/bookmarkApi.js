import api from "@/config/axios";

const toBookmarkedRecipeList = (response) =>
    response?.data?.data ?? response?.data ?? [];

export const getBookmarkedRecipes = async (userId) => {
    const response = await api.get(`/v1/bookmarks/${userId}`);
    return toBookmarkedRecipeList(response);
};

export const addBookmark = async (userId, recipeId) => {
    const response = await api.post(`/v1/bookmarks/${recipeId}`, null, {
        params: { userId },
    });
    return response.data;
};

export const removeBookmark = async (userId, recipeId) => {
    const response = await api.delete(`/v1/bookmarks/${recipeId}`, {
        params: { userId },
    });
    return response.data;
};

export const checkBookmarkStatus = async (userId, recipeId) => {
    const response = await api.get(`/v1/bookmarks/${recipeId}/status`, {
        params: { userId },
    });
    return response.data;
};
