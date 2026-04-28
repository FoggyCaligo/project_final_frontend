'use client';

import { useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useAuth } from "@/context/AuthContext";
import { loginApi, signupApi } from "@/api/authApi";
import LogoutButton from "@/components/layout/private/LogoutButton";

// 인증 상태에 따라 로그인 버튼 또는 로그아웃 버튼을 렌더링
// 미인증: 로그인 모달 (일반 로그인 + 카카오 로그인 + 회원가입 탭)
// 인증됨: LogoutButton (로그인 타입에 따라 일반/소셜 로그아웃 분기)
export default function LoginButton() {
    const { user, login } = useAuth();

    const [isOpen, setIsOpen] = useState(false);
    // 'login' | 'signup' — 모달 내 탭 전환
    const [tab, setTab] = useState("login");
    const [error, setError] = useState("");

    // 일반 로그인 폼
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");

    // 회원가입 폼
    const [signupLoginId, setSignupLoginId] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupNickname, setSignupNickname] = useState("");

    const resetForms = () => {
        setLoginId(""); setPassword("");
        setSignupLoginId(""); setSignupEmail("");
        setSignupPassword(""); setSignupNickname("");
        setError("");
    };

    const handleClose = () => {
        setIsOpen(false);
        setTab("login");
        resetForms();
    };

    // 일반 로그인 제출
    const handleLogin = async () => {
        setError("");
        if (!loginId || !password) {
            setError("아이디와 비밀번호를 입력해주세요.");
            return;
        }
        try {
            await loginApi(loginId, password);
            login(loginId, "general"); // AuthContext에 저장
            handleClose();
        } catch (err) {
            setError(err.message || "로그인에 실패했습니다.");
        }
    };

    // 카카오 로그인 (추후 카카오 RestApiKey 설정 후 구현)
    const handleKakaoLogin = () => {
        alert("카카오 로그인은 준비 중입니다.");
    };

    // 회원가입 제출
    const handleSignup = async () => {
        setError("");
        if (!signupLoginId || !signupEmail || !signupPassword || !signupNickname) {
            setError("모든 항목을 입력해주세요.");
            return;
        }
        try {
            await signupApi({
                loginId: signupLoginId,
                email: signupEmail,
                password: signupPassword,
                nickname: signupNickname,
            });
            setTab("login");
            setLoginId(signupLoginId);
            setError("회원가입이 완료되었습니다. 로그인해주세요.");
        } catch (err) {
            setError(err.message || "회원가입에 실패했습니다.");
        }
    };

    // 인증된 경우 → LogoutButton 렌더링
    if (user) return <LogoutButton />;

    return (
        <>
            <Button variant="secondary" handleClick={() => setIsOpen(true)}>
                로그인
            </Button>

            <Modal
                isOpen={isOpen}
                title={tab === "login" ? "로그인" : "회원가입"}
                onClose={handleClose}
                showFooter={false}
            >
                {/* 탭 전환 */}
                <div className="mb-5 flex gap-2 border-b pb-3">
                    <button
                        type="button"
                        onClick={() => { setTab("login"); setError(""); }}
                        className={`text-sm font-semibold pb-1 transition border-b-2 ${
                            tab === "login"
                                ? "border-[var(--primary)] text-[var(--primary)]"
                                : "border-transparent text-[var(--text-sub)]"
                        }`}
                    >
                        로그인
                    </button>
                    <button
                        type="button"
                        onClick={() => { setTab("signup"); setError(""); }}
                        className={`text-sm font-semibold pb-1 transition border-b-2 ${
                            tab === "signup"
                                ? "border-[var(--primary)] text-[var(--primary)]"
                                : "border-transparent text-[var(--text-sub)]"
                        }`}
                    >
                        회원가입
                    </button>
                </div>

                {tab === "login" ? (
                    <div className="flex flex-col gap-4">
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
                ) : (
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="아이디 (4~20자, 영문/숫자/_)"
                            value={signupLoginId}
                            onChange={(e) => setSignupLoginId(e.target.value)}
                            className="w-full rounded-lg border border-[var(--border)] px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[var(--primary)]"
                        />
                        <input
                            type="email"
                            placeholder="이메일"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            className="w-full rounded-lg border border-[var(--border)] px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[var(--primary)]"
                        />
                        <input
                            type="password"
                            placeholder="비밀번호 (8자 이상, 영문+숫자+특수문자)"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            className="w-full rounded-lg border border-[var(--border)] px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[var(--primary)]"
                        />
                        <input
                            type="text"
                            placeholder="닉네임 (2~20자)"
                            value={signupNickname}
                            onChange={(e) => setSignupNickname(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                            className="w-full rounded-lg border border-[var(--border)] px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[var(--primary)]"
                        />
                        {error && (
                            <p className={`text-xs ${error.includes("완료") ? "text-green-600" : "text-red-500"}`}>
                                {error}
                            </p>
                        )}
                        <Button variant="primary" handleClick={handleSignup} is_full>
                            회원가입
                        </Button>
                    </div>
                )}

                <p className="mt-4 text-center text-xs text-[var(--text-sub)]">
                    {tab === "login" ? (
                        <>계정이 없으신가요?{" "}
                            <button type="button" className="underline" onClick={() => setTab("signup")}>회원가입</button>
                        </>
                    ) : (
                        <>이미 계정이 있으신가요?{" "}
                            <button type="button" className="underline" onClick={() => setTab("login")}>로그인</button>
                        </>
                    )}
                </p>
            </Modal>
        </>
    );
}
