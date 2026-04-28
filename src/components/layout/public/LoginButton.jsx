'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useAuth } from "@/context/AuthContext";
import { loginApi } from "@/api/authApi";
import LogoutButton from "@/components/layout/private/LogoutButton";

export default function LoginButton() {
    const { user, login } = useAuth();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    // 이메일 인증 완료 후 리다이렉트 시 ?emailVerified=true 표시용
    const [emailVerifiedMsg, setEmailVerifiedMsg] = useState(
        typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("emailVerified") === "true"
            ? "이메일 인증이 완료되었습니다. 로그인해주세요."
            : ""
    );

    const handleClose = () => {
        setIsOpen(false);
        setLoginId("");
        setPassword("");
        setError("");
    };

    const handleLogin = async () => {
        setError("");
        if (!loginId || !password) {
            setError("아이디와 비밀번호를 입력해주세요.");
            return;
        }
        try {
            await loginApi(loginId, password);
            login(loginId, "general");
            handleClose();
        } catch (err) {
            setError(err.message || "로그인에 실패했습니다.");
        }
    };

    const handleKakaoLogin = () => {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
        window.location.href = `${apiBase}/v1/auth/kakao/login`;
    };

    if (user) return <LogoutButton />;

    return (
        <>
            <Button variant="secondary" handleClick={() => setIsOpen(true)}>
                로그인
            </Button>

            <Modal
                isOpen={isOpen}
                title="로그인"
                onClose={handleClose}
                showFooter={false}
            >
                <div className="flex flex-col gap-4">
                    {emailVerifiedMsg && (
                        <p className="rounded-lg bg-green-50 px-4 py-3 text-xs text-green-700">
                            {emailVerifiedMsg}
                        </p>
                    )}
                    <input
                        type="text"
                        placeholder="아이디"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        className="w-full rounded-lg border border-[var(--border)] px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        className="w-full rounded-lg border border-[var(--border)] px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    />
                    {error && <p className="text-xs text-red-500">{error}</p>}
                    <Button variant="primary" handleClick={handleLogin} is_full>
                        로그인
                    </Button>
                    <div className="flex items-center gap-3 text-[var(--text-sub)]">
                        <hr className="flex-1 border-[var(--border)]" />
                        <span className="text-xs">또는</span>
                        <hr className="flex-1 border-[var(--border)]" />
                    </div>
                    {/* 카카오 로그인 — RestApiKey 설정 후 활성화 */}
                    <button
                        type="button"
                        onClick={handleKakaoLogin}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FEE500] py-3 text-sm font-semibold text-[#3C1E1E] transition hover:opacity-90"
                    >
                        <span>🍫</span> 카카오로 로그인
                    </button>
                </div>

                <p className="mt-4 text-center text-xs text-[var(--text-sub)]">
                    계정이 없으신가요?{" "}
                    <Link
                        href="/signup"
                        onClick={handleClose}
                        className="font-semibold text-[var(--primary)] underline"
                    >
                        회원가입
                    </Link>
                </p>
            </Modal>
        </>
    );
}
