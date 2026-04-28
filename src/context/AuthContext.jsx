'use client';

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// user 구조: { loginId: string, loginType: 'general' | 'kakao' } | null
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
