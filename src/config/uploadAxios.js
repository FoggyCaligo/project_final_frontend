import axios from "axios";

const uploadApi = axios.create({
  // 환경 변수가 없으면 기본값(하드코딩 IP) 사용
  baseURL: process.env.NEXT_PUBLIC_APACHE_UPLOAD_URL ?? "http://43.201.1.45/preload_test.php",
});

uploadApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // 기존 axios.js와 동일한 방식으로 에러 정규화
    const status = error?.response?.status;
    const data = error?.response?.data;
    const message = data?.error ?? error?.message ?? "Upload API error";
    
    const normalizedError = {
      name: "UploadApiError",
      message,
      status: status ?? null,
      data: data ?? null,
      originalError: error ?? null,
    };

    return Promise.reject(normalizedError);
  }
);

export default uploadApi;