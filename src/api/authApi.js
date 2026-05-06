import api from "@/config/axios";
import { unwrapApiData } from "@/api/utils";

//getMeApi를 한번 호출하면, response를 저장하여 LoginId가 필요할 때마다 사용 가능하도록 임시저장
export let user = null;

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
export const getMeApi = async () => {
  const response = await api.get("/v1/auth/me", { withCredentials: true });
  user = unwrapApiData(response);
  return unwrapApiData(response);
};

// GET /api/v1/users/find-loginid?email= — 이메일로 아이디 찾기
export const findLoginIdApi = (email) =>
    api.get("/v1/users/find-loginid", { params: { email } });
