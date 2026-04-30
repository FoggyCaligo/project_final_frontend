import api from "@/config/axios";
import uploadApi from "@/config/uploadAxios";

// 1. PHP 서버로 이미지 업로드 (FormData 전송)
export const uploadImages = async (formData) => {
    const response = await uploadApi.post("", formData);
    return response.data;
};

// 2. Spring Boot 서버로 게시글 및 메타데이터 저장 (JSON 전송)
export const createPost = async (postData) => {
    const response = await api.post("/v1/posts", postData);
    return response.data;
};

// 3. 💡 새로 추가해야 할 부분: 특정 유저가 작성한 최근 게시글 목록 조회
export const getUserPosts = async (userId) => {
    const response = await api.get(`/v1/posts/users/${userId}`);
    return response.data;
};

export const getAllPosts = async (page = 0, size = 10) => {
    const response = await api.get(`/v1/posts?page=${page}&size=${size}`);
    return response.data; // Page 객체 반환 (content, totalPages 등 포함)
};

export const getPostDetail = async (postId) => {
    const response = await api.get(`/v1/posts/${postId}`);
    return response.data;
};

export const deletePost = async (postId) => {
    const response = await api.delete(`/v1/posts/${postId}`);
    return response.data;
};
