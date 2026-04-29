import api from "@/config/axios";

// 특정 유저의 북마크 레시피 목록 조회
export const getBookmarkedRecipes = async (userId) => {
    const response = await api.get(`/v1/bookmarks/${userId}`);
    return response.data;
};
