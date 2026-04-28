'use client';

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const AuthContext = createContext(null);

// user 구조: { loginId: string, loginType: 'general' | 'kakao' } | null
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const router = useRouter();

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

    // 카카오 로그인 콜백: URL 파라미터로 loginId 전달받아 세션 저장
    useEffect(() => {
        if (typeof window === "undefined") return;
        const params = new URLSearchParams(window.location.search);
        const kakaoLogin = params.get("kakaoLogin");
        const kakaoError = params.get("kakaoError");

        if (kakaoLogin === "success") {
            const loginId = params.get("loginId");
            if (loginId) {
                const userData = { loginId, loginType: "kakao" };
                sessionStorage.setItem("authUser", JSON.stringify(userData));
                setUser(userData);
            }
            // URL 파라미터 제거 (히스토리 교체)
            window.history.replaceState({}, "", window.location.pathname);
        } else if (kakaoError) {
            window.history.replaceState({}, "", window.location.pathname);
        }
    }, []);

    // 로그인 성공 후 호출: loginId와 로그인 타입을 세션에 저장
    const login = (loginId, loginType = "general") => {
        const userData = { loginId, loginType };
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
