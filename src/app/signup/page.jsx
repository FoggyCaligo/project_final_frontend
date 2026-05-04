'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import InputText from "@/components/ui/InputText";
import TextInput from "@/components/ui/TextInput";

import { signupApi, checkLoginIdApi } from "@/api/authApi";

export default function SignupPage() {
    const router = useRouter();

    const [loginId, setLoginId] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [nickname, setNickname] = useState("");

    const [loginIdChecked, setLoginIdChecked] = useState(false);
    const [loginIdAvailable, setLoginIdAvailable] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCheckLoginId = async () => {
        setError("");
        if (!loginId) {
            setError("아이디를 입력해주세요.");
            return;
        }
        try {
            const res = await checkLoginIdApi(loginId);
            const available = res.data?.data?.available;
            setLoginIdChecked(true);
            setLoginIdAvailable(available);
            if (!available) setError("이미 사용 중인 아이디입니다.");
        } catch (err) {
            setError(err.message || "아이디 확인에 실패했습니다.");
        }
    };

    const handleSignup = async () => {
        setError("");
        if (!loginId || !email || !password || !nickname) {
            setError("모든 항목을 입력해주세요.");
            return;
        }
        if (!loginIdChecked || !loginIdAvailable) {
            setError("아이디 중복 확인을 완료해주세요.");
            return;
        }
        setLoading(true);
        try {
            await signupApi({ loginId, email, password, nickname });
            setSuccess(true);
        } catch (err) {
            setError(err.message || "회원가입에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
                <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-white p-8 text-center shadow-sm">
                    <div className="mb-4 text-4xl">📧</div>
                    <h1 className="mb-2 text-xl font-bold text-[var(--text-main)]">이메일 인증을 완료해주세요</h1>
                    <p className="mb-1 text-sm text-[var(--text-sub)]">
                        <span className="font-semibold text-[var(--primary)]">{email}</span> 으로
                    </p>
                    <p className="mb-6 text-sm text-[var(--text-sub)]">
                        인증 링크를 발송했습니다. 이메일을 확인하여 인증을 완료한 후 로그인해주세요.
                    </p>
                    <p className="mb-6 text-xs text-[var(--text-sub)]">인증 링크는 24시간 동안 유효합니다.</p>
                    <Link href="/">
                        <Button variant="primary" is_full>로그인하러 가기</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
            <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-white p-8 shadow-sm">
                <h1 className="mb-6 text-2xl font-bold text-[var(--text-main)]">회원가입</h1>

                <div className="flex flex-col gap-4">
                    {/* 아이디 */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-[var(--text-sub)]">아이디</label>
                        <div className="grid gap-2" style={{ gridTemplateColumns: "1fr auto" }}>
                            <InputText
                                style="w-full min-w-0"
                                placeholder="4~20자, 영문/숫자/_"
                                setText={loginId}
                                getText={(value)=>{
                                    setLoginId(value);
                                    setLoginIdChecked(false);
                                    setLoginIdAvailable(false);
                                    setError("");
                                }}>
                            </InputText>

                            <Button handleClick={handleCheckLoginId}>
                                중복확인
                            </Button>
                        </div>
                        {loginIdChecked && loginIdAvailable && (
                            <p className="text-xs text-green-600">아이디를 사용할 수 있습니다.</p>
                        )}
                    </div>

                    {/* 이메일 */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-[var(--text-sub)]">이메일</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="example@email.com"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-[var(--border)] px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[var(--primary)]"
                        />
                        <p className="text-xs text-[var(--text-sub)]">가입 후 이메일 인증이 필요합니다.</p>
                    </div>

                    {/* 비밀번호 */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-[var(--text-sub)]">비밀번호</label>
                        <div className="grid gap-2" style={{ gridTemplateColumns: "1fr auto" }}>
                        
                            <InputText
                                type={showPassword ? "text" : "password"}
                                placeholder="8자 이상, 영문+숫자+특수문자"
                                setText={password}
                                getText={(value)=>setPassword(value)}
                            >
                            </InputText>
                            <Button handleClick={()=>setShowPassword((v) => !v)}>
                                {showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                            </Button>
                        </div>
                    </div>

                    {/* 닉네임 */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-[var(--text-sub)]">닉네임</label>
                        <input
                            id="nickname"
                            name="nickname"
                            type="text"
                            placeholder="2~20자"
                            autoComplete="nickname"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                            className="w-full rounded-lg border border-[var(--border)] px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[var(--primary)]"
                        />
                    </div>

                    {error && <p className="text-xs text-red-500">{error}</p>}

                    <Button variant="primary" handleClick={handleSignup} is_full disabled={loading}>
                        {loading ? "처리 중..." : "회원가입"}
                    </Button>
                </div>

                <p className="mt-6 text-center text-xs text-[var(--text-sub)]">
                    이미 계정이 있으신가요?{" "}
                    <Link href="/" className="font-semibold text-[var(--primary)] underline">
                        로그인
                    </Link>
                </p>
            </div>
        </div>
    );
}