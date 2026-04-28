import api from "@/config/axios";
import uploadApi from "@/config/uploadAxios";

// 1. PHP 서버로 이미지 업로드 (FormData 전송)
export const uploadImages = async (formData) => {
    // baseURL에 파일명(preload_test.php)까지 포함되어 있으므로 빈 문자열("")로 POST 요청
    const response = await uploadApi.post("", formData);
    return response.data;
};

// 2. Spring Boot 서버로 게시글 및 메타데이터 저장 (JSON 전송)
export const createPost = async (postData) => {
    const response = await api.post("/posts", postData);
    return response.data;
};