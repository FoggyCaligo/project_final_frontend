import api from "@/config/axios";

// POST /api/v1/auth2/login — Redis 기반 일반 로그인
export const loginApi = (loginId, password) =>
    api.post("/v1/auth2/login", { loginId, password });

// POST /api/v1/auth2/logout — Redis 블랙리스트 로그아웃
export const logoutApi = () =>
    api.post("/v1/auth2/logout");

// POST /api/v1/auth2/signup — Redis 이메일 토큰 회원가입
export const signupApi = ({ loginId, email, password, nickname }) =>
    api.post("/v1/auth2/signup", { loginId, email, password, nickname });

// GET /api/v1/auth2/check-login-id — 아이디 중복 확인
export const checkLoginIdApi = (loginId) =>
    api.get("/v1/auth2/check-login-id", { params: { loginId } });

// GET /api/v1/auth2/me — 현재 인증된 사용자 조회
export const getMeApi = () =>
    api.get("/v1/auth2/me");

// GET /api/v1/users/find-loginid?email= — 이메일로 아이디 찾기 (변경 없음)
export const findLoginIdApi = (email) =>
    api.get("/v1/users/find-loginid", { params: { email } });