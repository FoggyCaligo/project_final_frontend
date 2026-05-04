import api from "@/config/axios";

// POST /api/v1/auth/login — 일반 로그인 (서버가 accessToken/refreshToken 쿠키 설정)
export const loginApi = (loginId, password) =>
    api.post("/v1/auth/login", { loginId, password });

// POST /api/v1/auth/logout — 로그아웃 (서버가 쿠키 삭제 + 세션 무효화)
export const logoutApi = () =>
    api.post("/v1/auth/logout");

// POST /api/v1/auth/signup — 회원가입 (팀 공식 스펙: /auth/signup)
export const signupApi = ({ loginId, email, password, nickname }) =>
    api.post("/v1/auth/signup", { loginId, email, password, nickname });

// GET /api/v1/auth/check-login-id — 아이디 중복 확인 (팀 공식 스펙 신규)
export const checkLoginIdApi = (loginId) =>
    api.get("/v1/auth/check-login-id", { params: { loginId } });

// GET /api/v1/auth/me — 현재 인증된 사용자 조회 (팀 공식 스펙 신규)
export const getMeApi = () =>
    api.get("/v1/auth/me");

// GET /api/v1/users/find-loginid?email= — 이메일로 아이디 찾기
export const findLoginIdApi = (email) =>
    api.get("/v1/users/find-loginid", { params: { email } });