import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const RETRYABLE_NETWORK_CODE = "ERR_NETWORK";
const MAX_NETWORK_RETRIES = 2;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableNetworkError(error) {
  return (
    error?.code === RETRYABLE_NETWORK_CODE &&
    !error?.response
  );
}

api.interceptors.request.use(
  (config) => {
    // 서버가 HTTP-only 쿠키(accessToken)로 인증 → UserIdResolutionFilter가 JWT에서 X-User-Id를 자동 주입
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;

    if (config && isRetryableNetworkError(error)) {
      const retryCount = config.__networkRetryCount ?? 0;

      if (retryCount < MAX_NETWORK_RETRIES) {
        config.__networkRetryCount = retryCount + 1;

        // 1st retry: 300ms, 2nd retry: 800ms
        const backoffMs = retryCount === 0 ? 300 : 800;
        await delay(backoffMs);

        return api(config);
      }
    }

    const status = error?.response?.status;
    const data = error?.response?.data;
    const message =
      data?.message ??
      error?.message ??
      "Unexpected API error";

    const normalizedError = {
      name: "ApiError",
      message,
      status: status ?? null,
      data: data ?? null,
      code: error?.code ?? null,
      url: error?.config?.url ?? null,
      method: error?.config?.method ?? null,
      originalError: error ?? null,
    };

    return Promise.reject(normalizedError);
  }
);

export default api;
