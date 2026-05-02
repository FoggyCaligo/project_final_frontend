import api from "@/config/axios";
import { unwrapApiData } from "@/api/utils";

//getMeApi를 한번 호출하면, response를 저장하여 LoginId가 필요할 때마다 사용 가능하도록 임시저장
export let user = null;

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

// GET /api/v1/auth/me — 현재 인증된 사용자 조회 (팀 공식 스펙 신규)
export const getMeApi = async () => {
  const response = await api.get("/v1/auth/me", { withCredentials: true });
  user = unwrapApiData(response);
  return unwrapApiData(response);
};

// GET /api/v1/users/find-loginid?email= — 이메일로 아이디 찾기 (변경 없음)
export const findLoginIdApi = (email) =>
    api.get("/v1/users/find-loginid", { params: { email } });
