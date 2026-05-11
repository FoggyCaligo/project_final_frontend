'use client';

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import LoginButton from "@/components/layout/public/LoginButton";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
    const router = useRouter();
    const { user } = useAuth();

    return (
        <header
            className="sticky top-0 z-50 border-b backdrop-blur"
            style={{
                backgroundColor: "rgba(255,250,243,0.9)",
                borderColor: "var(--border)",
            }}
        >
            <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <div
                        className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                        style={{ backgroundColor: "var(--primary)" }}
                    >
                        냉
                    </div>
                    <p className="text-base font-semibold" style={{ color: "var(--text-main)" }}>
                        오늘의 냉장고
                    </p>
                </div>

                <nav className="hidden gap-8 text-sm md:flex" style={{ color: "var(--text-sub)" }}>
                    <a href="#service">서비스 소개</a>
                    <a href="#features">주요 기능</a>
                    <a href="#process">이용 방법</a>
                </nav>

                {/* 시작하기 버튼 옆에 로그인/로그아웃 버튼 배치 */}
                <div className="flex items-center gap-3">
                    <Button handleClick={() => {
                        if (user) {
                            router.push("/dashboard");
                        } else {
                            router.push("/signup");
                        }
                    }}>시작하기</Button>
                    <LoginButton />
                </div>
            </div>
        </header>
    );
}
