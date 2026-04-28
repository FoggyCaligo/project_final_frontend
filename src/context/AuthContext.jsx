'use client';

import { createContext, useContext, useState, useEffect } from "react";
import { getMeApi } from "@/api/authApi";

const AuthContext = createContext(null);

// user 구조: { loginId: string, loginType: 'general' | 'kakao', nickname: string } | null
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // 새로고침 시 sessionStorage에서 복원
    useEffect(() => {
        const stored = sessionStorage.getItem("authUser");
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                sessionStorage.removeItem("authUser");
            }
        }
    }, []);

    // 카카오 로그인 콜백: URL 파라미터로 loginId 전달받아 세션 저장 후 nickname 조회
    useEffect(() => {
        if (typeof window === "undefined") return;
        const params = new URLSearchParams(window.location.search);
        const kakaoLogin = params.get("kakaoLogin");
        const kakaoError = params.get("kakaoError");

        if (kakaoLogin === "success") {
            const loginId = params.get("loginId");
            if (loginId) {
                getMeApi()
                    .then((res) => {
                        const nickname = res.data?.data?.nickname ?? loginId;
                        const userData = { loginId, loginType: "kakao", nickname };
                        sessionStorage.setItem("authUser", JSON.stringify(userData));
                        setUser(userData);
                    })
                    .catch(() => {
                        const userData = { loginId, loginType: "kakao", nickname: loginId };
                        sessionStorage.setItem("authUser", JSON.stringify(userData));
                        setUser(userData);
                    });
            }
            window.history.replaceState({}, "", window.location.pathname);
        } else if (kakaoError) {
            window.history.replaceState({}, "", window.location.pathname);
        }
    }, []);

    // 로그인 성공 후 호출: loginId, 로그인 타입, nickname을 세션에 저장
    const login = (loginId, loginType = "general", nickname = loginId) => {
        const userData = { loginId, loginType, nickname };
        sessionStorage.setItem("authUser", JSON.stringify(userData));
        setUser(userData);
    };

    // 로그아웃 후 호출: 세션 초기화
    const logout = () => {
        sessionStorage.removeItem("authUser");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
