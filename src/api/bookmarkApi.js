import api from "@/config/axios";
import { unwrapApiData } from "@/api/utils";

export const getBookmarkedRecipes = async (userId) => {
    const response = await api.get(`/v1/bookmarks/${userId}`);
    return unwrapApiData(response, []);
};
export const addBookmark = async (recipeId, userId)=>{
    const response = await api.post(`/v1/bookmarks/${recipeId}?userId=${userId}`);
    return unwrapApiData(response,null);
}
export const removeBookmark = async(recipeId, userId)=>{
    const response = await api.delete(`/v1/bookmarks/${recipeId}?userId=${userId}`);
    return unwrapApiData(response,null);
}

export const checkBookmarkStatus = async(recipeId, userId)=>{
    const response = await api.get(`/v1/bookmarks/${recipeId}/status`, {params: {userId}});
    return unwrapApiData(response, null);
}

export const toggleBookmark = async(recipeId, userId)=>{
    const status = await checkBookmarkStatus(recipeId, userId);
    
    console.log("status:",status);
}
