import api from "@/config/axios";

// 특정 유저의 북마크 레시피 목록 조회
export const getBookmarkedRecipes = async (userId) => {
    // baseURL이 /api/v1 이므로 실제로는 /api/v1/bookmarks/{userId} 로 요청이 갑니다.
    const response = await api.get(`/bookmarks/${userId}`);
    return response.data;
};

// 💡 파라미터로 userId와 recipeId를 모두 받고, URL에 ?userId= 를 붙여서 전송해야 합니다.
export const addBookmark = async (userId, recipeId) => {
    const response = await api.post(`/bookmarks/${recipeId}?userId=${userId}`);
    return response.data;
};

export const removeBookmark = async (userId, recipeId) => {
    const response = await api.delete(`/bookmarks/${recipeId}?userId=${userId}`);
    return response.data;
};

export const checkBookmarkStatus = async (userId, recipeId) => {
    const response = await api.get(`/bookmarks/${recipeId}/status?userId=${userId}`);
    return response.data;
};