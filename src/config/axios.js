import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAccessToken = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem("accessToken");
};

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;
    const message =
      data?.message ??
      error?.message ??
      "Unexpected API error";

    const normalizedError = new Error(message);
    normalizedError.name = "ApiError";
    normalizedError.status = status;
    normalizedError.data = data;
    normalizedError.originalError = error;

    return Promise.reject(normalizedError);
  }
);

export default api;
