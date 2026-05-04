import api from "@/config/axios";
import uploadApi from "@/config/uploadAxios";

const unwrapApiData = (response, fallback = null) =>
    response?.data?.data ?? response?.data ?? fallback;

export const uploadImages = async (formData) => {
    const response = await uploadApi.post("", formData);
    return response.data;
};

export const createPost = async (postData) => {
    const response = await api.post("/posts", postData);
    return response.data;
};

export const getUserPosts = async (userId) => {
    const response = await api.get(`/posts/users/${userId}`);
    return unwrapApiData(response, []);
};

export const getAllPosts = async (page = 0, size = 10) => {
    const response = await api.get(`/posts?page=${page}&size=${size}`);
    return response.data;
};

export const getPostDetail = async (postId) => {
    const response = await api.get(`/posts/${postId}`);
    return unwrapApiData(response, null);
};

export const deletePost = async (postId) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
};

export const updatePost = async (postId, postData) => {
    const response = await api.patch(`/posts/${postId}`, postData);
    return response.data;
};
