"use client";
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import InputText from '@/components/ui/InputText';
import CustomTag from '@/components/ui/Tag';
import Section from '@/components/ui/Section';
import Modal from '@/components/ui/Modal'; 
import Link from 'next/link'; 
import { useAuth } from "@/context/AuthContext"; 
import { loginApi } from "@/api/authApi"; 
import { getBookmarkedRecipes } from '@/api/bookmarkApi';
import { uploadImages, getPostDetail, updatePost } from '@/api/postApi';

export default function CommunityEditPage() {
    const { postId } = useParams();
    const router = useRouter();
    const { login } = useAuth();

    // 로그인 관련 상태 
    const [isLoginNeeded, setIsLoginNeeded] = useState(false);
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    const [emailVerifiedMsg, setEmailVerifiedMsg] = useState(
        typeof window !== "undefined" &&
            new URLSearchParams(window.location.search).get("emailVerified") === "true"
            ? "이메일 인증이 완료되었습니다. 로그인해주세요."
            : ""
    );

    // 게시글 상태들
    const [images, setImages] = useState([]);
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [recipe, setRecipe] = useState(""); 
    const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);
    
    // 동적으로 변경될 로그인 유저 ID 상태 관리
    const [currentUserId, setCurrentUserId] = useState(null);
    
    // 1. 컴포넌트 마운트 시 세션스토리지에서 유저 정보 가져오기 및 권한 체크
    useEffect(() => {
        const authUserStr = sessionStorage.getItem('authUser');
        if (authUserStr) {
            try {
                const authUser = JSON.parse(authUserStr);
                setCurrentUserId(authUser.userId);
                setIsLoginNeeded(false);
            } catch (error) {
                console.error("세션 데이터 파싱 오류:", error);
                setIsLoginNeeded(true);
            }
        } else {
            setIsLoginNeeded(true);
        }
    }, []);
    
    // 2. 화면 로드 시 게시글 정보 및 작성자 확인 로직 수행
    useEffect(() => {
        if (!currentUserId) return;

        const fetchInitialData = async () => {
            try {
                // 1) 게시글 상세 정보를 먼저 불러와 작성자 여부 확인
                const postData = await getPostDetail(postId);
                
                // 💡 작성자 불일치 시 접근 차단 (본인 글이 아님)
                if (Number(postData.authorUserId) !== Number(currentUserId)) {
                    alert("올바르지 않은 접근입니다.");
                    router.push('/community');
                    return; // 함수 실행 즉시 종료
                }

                // 2) 본인임이 확인된 후에만 북마크 목록 로드
                const bookmarkData = await getBookmarkedRecipes(currentUserId);
                setBookmarkedRecipes(bookmarkData);

                // 3) 상태 업데이트 적용
                setTitle(postData.title);
                setContent(postData.content);
                
                if (postData.recipeId) {
                    setRecipe(postData.recipeId.toString());
                } else if (bookmarkData && bookmarkData.length > 0) {
                    setRecipe(bookmarkData[0].recipeId.toString());
                }

                if (postData.images && postData.images.length > 0) {
                    const loadedImages = postData.images.map((img, idx) => ({
                        id: `existing-${idx}`,
                        preview: `https://www.todayfridge.today/uploads/community/${img.storedName}`,
                        isExisting: true,
                        storedName: img.storedName
                    }));
                    setImages(loadedImages);
                }
            } catch (error) {
                console.error("데이터 로드 실패:", error);
                alert("게시글 정보를 불러오지 못했습니다.");
                router.back();
            }
        };

        if (postId) fetchInitialData();

        return () => {
            images.forEach(img => {
                if (!img.isExisting) URL.revokeObjectURL(img.preview);
            });
        };
    }, [postId, currentUserId, router]); 

    // 직접 로그인 처리 함수
    const handleDirectLogin = async () => {
        setLoginError("");
        if (!loginId || !password) {
            setLoginError("아이디와 비밀번호를 입력해주세요.");
            return;
        }
        try {
            await loginApi(loginId, password);
            await login(loginId, "general");
            
            const updatedUserStr = sessionStorage.getItem('authUser');
            if (updatedUserStr) {
                const updatedUser = JSON.parse(updatedUserStr);
                setCurrentUserId(updatedUser.userId);
            }
            setIsLoginNeeded(false);
        } catch (err) {
            setLoginError(err.message || "로그인에 실패했습니다.");
        }
    };

    const handleKakaoLogin = () => {
        const apiBase = (
            process.env.NEXT_PUBLIC_API_URL ||
            process.env.NEXT_PUBLIC_API_BASE_URL ||
            "/api"
        ).replace(/\/$/, "");

        window.location.href = `${apiBase}/v1/auth/kakao/login`;
    };

    const processFiles = (files) => {
        const validExtensions = ['image/jpeg', 'image/png', 'image/webp'];
        const newImages = Array.from(files)
            .filter(file => validExtensions.includes(file.type))
            .map(file => ({
                file,
                id: Math.random().toString(36).substring(2, 9),
                preview: URL.createObjectURL(file),
                isExisting: false
            }));

        setImages(prev => [...prev, ...newImages].slice(0, 5));
    };

    const handleUpdate = async () => {
        if (isLoading) return;
        if (!currentUserId) {
            alert("로그인 정보를 확인할 수 없습니다.");
            setIsLoginNeeded(true);
            return;
        }
        if (images.length === 0) {
            alert("이미지를 하나 이상 등록해주세요.");
            return;
        }
        if (!recipe) {
            alert("북마크한 레시피를 선택해주세요.");
            return;
        }

        setIsLoading(true);

        try {
            const newFiles = images.filter(img => !img.isExisting);
            let uploadedData = null;

            if (newFiles.length > 0) {
                const formData = new FormData();
                formData.append('title', title);
                formData.append('content', content);
                formData.append('recipe', recipe);
                newFiles.forEach((img) => formData.append('images[]', img.file));

                const uploadResult = await uploadImages(formData);
                if (uploadResult.success) {
                    uploadedData = uploadResult.data;
                } else {
                    throw new Error(uploadResult.error || "이미지 서버 업로드 실패");
                }
            }

            const retainedImages = images
                .filter(img => img.isExisting)
                .map(img => img.storedName);

            const finalPostData = {
                title: title,
                content: content,
                recipe: recipe,
                image_files: uploadedData,     
                retained_images: retainedImages 
            };

            const dbResult = await updatePost(postId, finalPostData);

            if (dbResult.success) {
                alert("게시글이 성공적으로 수정되었습니다.");
                router.push(`/community/detail/${postId}`);
            }
        } catch (error) {
            console.error("수정 오류:", error);
            alert(`오류가 발생했습니다: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragOver = useCallback((e) => { e.preventDefault(); setIsDragActive(true); }, []);
    const handleDragLeave = useCallback((e) => { e.preventDefault(); setIsDragActive(false); }, []);
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragActive(false);
        if (e.dataTransfer.files?.length > 0) processFiles(e.dataTransfer.files);
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files?.length > 0) {
            processFiles(e.target.files);
            e.target.value = null;
        }
    };

    const removeImage = (idToRemove) => {
        setImages(prev => {
            const img = prev.find(i => i.id === idToRemove);
            if (img && !img.isExisting) URL.revokeObjectURL(img.preview);
            return prev.filter(i => i.id !== idToRemove);
        });
    };

    const placeholderSvg = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%271280%27%20height%3D%27800%27%20viewBox%3D%270%200%201280%20800%27%3E%0A%20%20%20%20%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20fill%3D%27%23ECE7DD%27/%3E%0A%20%20%20%20%3Ctext%20x%3D%27640%27%20y%3D%27400%27%20text-anchor%3D%27middle%27%20font-family%3D%27sans-serif%27%20font-size%3D%2732%27%20fill%3D%27%237A847D%27%3E%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EB%AF%B8%EB%A6%AC%EB%B3%B4%EA%B8%B0%3C/text%3E%0A%3C/svg%3E";

    // 권한이 없을 때 띄우는 모달
    if (isLoginNeeded) {
        return (
            <Modal
                isOpen={true}
                title="로그인"
                onClose={() => router.push('/community')} // 💡 닫기 버튼 누르면 목록으로 이동
                showFooter={false}
                variant="login"
            >
                <div className="flex flex-col gap-4">
                    {emailVerifiedMsg && (
                        <p className="rounded-lg bg-green-50 px-4 py-3 text-xs text-green-700">
                            {emailVerifiedMsg}
                        </p>
                    )}
                    <input
                        id="loginId"
                        name="loginId"
                        type="text"
                        placeholder="아이디"
                        autoComplete="username"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleDirectLogin()}
                        className="w-full rounded-lg border border-[var(--border)] px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    />
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="비밀번호"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleDirectLogin()}
                            className="w-full rounded-lg border border-[var(--border)] px-4 py-3 pr-11 text-sm outline-none focus:ring-1 focus:ring-[var(--primary)]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-sub)] hover:text-[var(--text-main)]"
                            tabIndex={-1}
                            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {loginError && <p className="text-xs text-red-500">{loginError}</p>}
                    <Button variant="primary" handleClick={handleDirectLogin} is_full>
                        로그인
                    </Button>
                    <div className="flex items-center gap-3 text-[var(--text-sub)]">
                        <hr className="flex-1 border-[var(--border)]" />
                        <span className="text-xs">또는</span>
                        <hr className="flex-1 border-[var(--border)]" />
                    </div>
                    {/* 카카오 로그인 */}
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
                        className="font-semibold text-[var(--primary)] underline"
                    >
                        회원가입
                    </Link>
                </p>
            </Modal>
        );
    }

    return (
        <main className="w-full">
            <Section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                    {/* 후기 수정 폼 */}
                    <Card style={{ margin: 0, padding: '24px' }}>
                        <h1 className="text-xl font-bold mb-2">후기 수정</h1>
                        <p className="text-sm text-[var(--text-sub)] mb-5">
                            작성하신 후기의 제목, 내용, 이미지를 수정할 수 있습니다.
                        </p>

                        <div className="flex flex-col gap-2 mb-4">
                            <label className="text-sm font-bold">북마크한 레시피 선택</label>
                            <select
                                className="w-full min-h-[46px] px-4 border border-[var(--border)] rounded-xl bg-white focus:outline-none focus:border-[var(--primary)] transition"
                                value={recipe}
                                onChange={(e) => setRecipe(e.target.value)}
                            >
                                {bookmarkedRecipes.length > 0 ? (
                                    bookmarkedRecipes.map((item) => (
                                        <option key={item.recipeId} value={item.recipeId}>
                                            {item.title}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>북마크한 레시피가 없습니다</option>
                                )}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2 mb-4">
                            <label className="text-sm font-bold">제목</label>
                            <InputText
                                variant="secondary"
                                is_full="true"
                                placeholder="제목을 입력하세요"
                                getText={setTitle}
                                setText={title}
                            />
                        </div>

                        <div className="flex flex-col gap-2 mb-4">
                            <label className="text-sm font-bold">후기 내용</label>
                            <textarea
                                className="w-full min-h-[140px] p-4 border border-[var(--border)] rounded-xl bg-white focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)] focus:ring-opacity-15 transition resize-y"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="flex flex-col gap-2 mb-4">
                            <label className="text-sm font-bold mb-2">이미지 추가 업로드 (최대 5장)</label>
                            <div
                                className={`w-full flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${isDragActive ? 'border-[var(--primary)] bg-[var(--color-primary-light)]' : 'border-[var(--border)] hover:bg-gray-50'}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <span className="text-[var(--text-sub)] text-sm">새 이미지를 드래그하거나 클릭하여 추가하세요</span>
                                <input
                                    ref={fileInputRef}
                                    className="hidden"
                                    type="file"
                                    accept="image/jpeg, image/png, image/webp"
                                    multiple
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-5">
                            <Button variant="primary" handleClick={handleUpdate} disabled={isLoading}>
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        수정 중...
                                    </div>
                                ) : "수정 완료"}
                            </Button>
                            <Button variant="secondary" handleClick={() => router.back()}>취소</Button>
                        </div>
                    </Card>

                    {/* 업로드 미리보기 */}
                    <Card style={{ margin: 0, padding: '24px' }}>
                        <h2 className="text-xl font-bold mb-4">
                            이미지 미리보기 <span className="text-sm font-normal text-[var(--text-sub)]">({images.length}/5)</span>
                        </h2>

                        {images.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                                {images.map((img) => (
                                    <div key={img.id} className="relative overflow-hidden rounded-xl bg-[var(--soft-bg)] aspect-square border border-[var(--border)] group">
                                        <img className="w-full h-full object-cover" src={img.preview} alt="미리보기" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(img.id)}
                                            className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all font-bold"
                                        >✕</button>
                                        {img.isExisting && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[10px] py-1 text-center">기존 이미지</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-xl border border-[var(--border)] opacity-70 aspect-[16/10]">
                                <img className="w-full h-full object-cover" src={placeholderSvg} alt="비어 있음" />
                            </div>
                        )}
                        <div className="flex flex-wrap gap-2 mt-4">
                            <CustomTag variant="secondary">기존 이미지 유지 가능</CustomTag>
                            <CustomTag color="success">PATCH 메소드 대응</CustomTag>
                        </div>
                    </Card>
                </div>
            </Section>
        </main>
    );
}