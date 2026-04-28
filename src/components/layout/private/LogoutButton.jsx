'use client';

import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { logoutApi } from "@/api/authApi";

// 로그인 타입(loginType)에 따라 일반 로그아웃 / 카카오 로그아웃 버튼을 렌더링
// loginType: 'general' → 일반 로그아웃 (서버 세션 무효화)
// loginType: 'kakao'   → 카카오 로그아웃 (카카오 SDK 연동 예정)
export default function LogoutButton() {
    const { user, logout } = useAuth();

    const handleGeneralLogout = async () => {
        try {
            await logoutApi(); // 서버에서 쿠키 삭제 + 세션 해시 무효화
        } catch {
            // 서버 오류와 관계없이 클라이언트 세션은 초기화
        } finally {
            logout(); // AuthContext 및 sessionStorage 초기화
        }
    };

    // 카카오 로그아웃 — 카카오 RestApiKey 설정 후 SDK 연동 예정
    const handleKakaoLogout = async () => {
        try {
            await logoutApi();
        } catch {
            // ignore
        } finally {
            logout();
        }
    };

    if (!user) return null;

    if (user.loginType === "kakao") {
        return (
            <Button variant="secondary" handleClick={handleKakaoLogout}>
                카카오 로그아웃
            </Button>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--text-sub)]">{user.loginId}</span>
            <Button variant="secondary" handleClick={handleGeneralLogout}>
                로그아웃
            </Button>
        </div>
    );
}
