import api from "@/config/axios";
import uploadApi from "@/config/uploadAxios";

const unwrapApiData = (response, fallback = null) =>
    response?.data?.data ?? response?.data ?? fallback;

export const uploadImages = async (formData) => {
    const response = await uploadApi.post("", formData);
    return response.data;
};

export const createPost = async (postData) => {
    const response = await api.post("/v1/posts", postData);
    return response.data;
};

export const getUserPosts = async (userId) => {
    const response = await api.get(`/v1/posts/users/${userId}`);
    return unwrapApiData(response, []);
};

export const getAllPosts = async (page = 0, size = 10) => {
    const response = await api.get(`/v1/posts?page=${page}&size=${size}`);
    return response.data;
};

export const getPostDetail = async (postId) => {
    const response = await api.get(`/v1/posts/${postId}`);
    return unwrapApiData(response, null);
};

export const deletePost = async (postId) => {
    const response = await api.delete(`/v1/posts/${postId}`);
    return response.data;
};

export const updatePost = async (postId, postData) => {
    const response = await api.patch(`/v1/posts/${postId}`, postData);
    return response.data;
};

// 💡 좋아요 API 추가
export const addPostLike = async (postId, userId) => {
    const response = await api.post(`/v1/posts/${postId}/likes?userId=${userId}`);
    return response.data;
};

export const removePostLike = async (postId, userId) => {
    const response = await api.delete(`/v1/posts/${postId}/likes?userId=${userId}`);
    return response.data;
};

export const getPostLikeStatus = async (postId, userId) => {
    const response = await api.get(`/v1/posts/${postId}/likes/status?userId=${userId}`);
    return response.data;
};

// 💡 신고 API 추가
export const addPostReport = async (postId, userId) => {
    // 임시로 reasonCode나 detailText는 비워두고 넘깁니다. (추후 모달 등에서 값 추가 가능)
    const response = await api.post(`/v1/posts/${postId}/reports?userId=${userId}`);
    return response.data;
};

export const getPostReportStatus = async (postId, userId) => {
    const response = await api.get(`/v1/posts/${postId}/reports/status?userId=${userId}`);
    return response.data;
};

// 💡 사용자 팔로우 관련 API (Git 충돌 방지를 위해 postApi.js 에서 관리)
export const addFollow = async (followeeId, followerId) => {
    const response = await api.post(`/v1/users/${followeeId}/follow?followerId=${followerId}`);
    return response.data;
};

export const removeFollow = async (followeeId, followerId) => {
    const response = await api.delete(`/v1/users/${followeeId}/follow?followerId=${followerId}`);
    return response.data;
};

export const checkFollowStatus = async (followeeId, followerId) => {
    const response = await api.get(`/v1/users/${followeeId}/follow/status?followerId=${followerId}`);
    return response.data;
};