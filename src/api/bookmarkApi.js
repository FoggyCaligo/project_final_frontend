import api from "@/config/axios";

const unwrapApiData = (response, fallback = []) =>
    response?.data?.data ?? response?.data ?? fallback;

export const getBookmarkedRecipes = async (userId) => {
    const response = await api.get(`/bookmarks/${userId}`);
    return unwrapApiData(response, []);
};
