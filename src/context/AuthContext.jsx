'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getMeApi } from "@/api/authApi";

const AuthContext = createContext(null);

// user 구조: { loginId: string, loginType: 'general' | 'kakao', nickname: string } | null
// NOSONAR: javascript:S6774 (TypeScript 미사용 프로젝트이므로 propTypes 생략)
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const router = useRouter();
    const pathname = usePathname();

    // 새로고침 시 sessionStorage에서 복원
    useEffect(() => {
        const stored = sessionStorage.getItem("authUser");
        if (stored) {
            try {
                // Next.js Hydration Mismatch를 막기 위해 useEffect 내부 초기화가 필수적입니다.
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setUser(JSON.parse(stored));
            } catch {
                sessionStorage.removeItem("authUser");
            }
        }
    }, []);

    // 카카오 로그인 콜백: URL 파라미터로 loginId 전달받아 세션 저장 후 nickname 조회
    useEffect(() => {
        if (globalThis.window === undefined) return;
        const params = new URLSearchParams(globalThis.window.location.search);
        const kakaoLogin = params.get("kakaoLogin");
        const kakaoError = params.get("kakaoError");

        if (kakaoLogin === "success") {
            const loginId = params.get("loginId");
            if (loginId) {
                getMeApi()
                    .then((res) => {
                        const nickname = res.data?.data?.nickname ?? loginId;
                        const userData = { loginId, loginType: "kakao", nickname };
                        try {
                            sessionStorage.setItem("authUser", JSON.stringify(userData));
                        } catch (e) {
                            console.warn("sessionStorage 접근이 차단되었습니다.", e);
                        }
                        setUser(userData);
                    })
                    .catch(() => {
                        const userData = { loginId, loginType: "kakao", nickname: loginId };
                        try {
                            sessionStorage.setItem("authUser", JSON.stringify(userData));
                        } catch (e) {
                            console.warn("sessionStorage 접근이 차단되었습니다.", e);
                        }
                        setUser(userData);
                    });
            }
            // Next.js 라우터를 사용하여 안전하게 URL 파라미터 정리
            router.replace(pathname);
        } else if (kakaoError) {
            router.replace(pathname);
        }
    }, [pathname, router]);

    // 로그인 성공 후 호출: loginId, 로그인 타입, nickname을 세션에 저장
    const login = useCallback((loginId, loginType = "general", nickname = loginId) => {
        const userData = { loginId, loginType, nickname };
        try {
            sessionStorage.setItem("authUser", JSON.stringify(userData));
        } catch (e) {
            console.warn("sessionStorage 저장 에러:", e);
        }
        setUser(userData);
    }, []);

    // 로그아웃 후 호출: 세션 초기화
    const logout = useCallback(() => {
        sessionStorage.removeItem("authUser");
        setUser(null);
    }, []);

    // Provider의 value 객체가 매 렌더링마다 재생성되는 것을 방지하여 성능 최적화
    const contextValue = useMemo(() => ({ user, login, logout }), [user, login, logout]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth 훅은 AuthProvider 내부에서만 호출해야 합니다.");
    }
    return context;
};

export default AuthContext;