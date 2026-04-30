import api from "@/config/axios";

// 특정 유저의 북마크 레시피 목록 조회
export const getBookmarkedRecipes = async (userId) => {
    // baseURL이 /api/v1 이므로 실제로는 /api/v1/bookmarks/{userId} 로 요청이 갑니다.
    const response = await api.get(`/bookmarks/${userId}`);
    return response.data;
};