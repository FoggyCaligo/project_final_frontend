import api from "@/config/axios";

// 변경됨: 특정 유저의 북마크 레시피 목록 조회
const unwrapApiData = (response, fallback = []) =>
    response?.data?.data ?? response?.data ?? fallback;

export const getBookmarkedRecipes = async (userId) => {
    const response = await api.get(`/v1/bookmarks/${userId}`);
    return unwrapApiData(response, []);
};

// 💡 파라미터로 userId와 recipeId를 모두 받고, URL에 ?userId= 를 붙여서 전송해야 합니다.
export const addBookmark = async (userId, recipeId) => {
    const response = await api.post(`/v1/bookmarks/${recipeId}?userId=${userId}`);
    return response.data;
};

export const removeBookmark = async (userId, recipeId) => {
    const response = await api.delete(`/v1/bookmarks/${recipeId}?userId=${userId}`);
    return response.data;
};

export const checkBookmarkStatus = async (userId, recipeId) => {
    const response = await api.get(`/v1/bookmarks/${recipeId}/status?userId=${userId}`);
    return response.data;
};
