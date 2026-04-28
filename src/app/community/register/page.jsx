"use client";
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import InputText from '@/components/ui/InputText';
import CustomTag from '@/components/ui/Tag';
import Section from '@/components/ui/Section';
import PostCard from '@/app/community/components/PostCard';

// 방금 만든 API 모듈 import
import { uploadImages, createPost } from '@/api/postApi';

export default function CommunityRegisterPage() {
    const [images, setImages] = useState([]);
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    // state 초기값도 숫자로 변경 (부추전의 ID가 1번이라고 가정)
    const [recipe, setRecipe] = useState("1");
    const router = useRouter();

    useEffect(() => {
        return () => {
            images.forEach(img => URL.revokeObjectURL(img.preview));
        };
    }, []);

    const processFiles = (files) => {
        const validExtensions = ['image/jpeg', 'image/png', 'image/webp'];
        const newImages = Array.from(files)
            .filter(file => validExtensions.includes(file.type))
            .map(file => ({
                file,
                id: Math.random().toString(36).substring(2, 9),
                preview: URL.createObjectURL(file),
            }));

        setImages(prev => {
            const combined = [...prev, ...newImages];
            return combined.slice(0, 5);
        });
    };

    const handleSubmit = async () => {
        if (images.length === 0) {
            alert("이미지를 하나 이상 등록해주세요.");
            return;
        }

        try {
            // ==========================================
            // Step 1. PHP 서버로 이미지 업로드 요청
            // ==========================================
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('recipe', recipe);

            images.forEach((img) => {
                formData.append('images[]', img.file);
            });

            // axios 기반의 모듈화된 API 호출
            const uploadResult = await uploadImages(formData);

            if (uploadResult.success) {
                console.log(`[Upload Success] ${uploadResult.uploaded_count}개의 이미지 업로드 완료`);

                // ==========================================
                // Step 2. Spring Boot 서버로 메타데이터 및 게시글 정보 전송
                // ==========================================
                const finalPostData = {
                    userId: 1, // 테스트용 임시 유저 ID
                    title: title,
                    content: content,
                    recipe: recipe, // 테스트용 임시 레시피 ID
                    image_files: uploadResult.data
                };

                // axios 기반의 모듈화된 API 호출
                const dbResult = await createPost(finalPostData);

                if (dbResult.success) {
                    console.log("[Submit Success] 게시글 등록이 완벽하게 처리되었습니다!");
                    alert("게시글이 성공적으로 등록되었습니다.");
                    // router.push('/community');
                }
            } else {
                console.error("[Upload Error] 서버 반환 에러:", uploadResult.error);
                alert("업로드에 실패했습니다: " + (uploadResult.error || "알 수 없는 에러"));
            }
        } catch (error) {
            console.error("[Submit Exception] API 흐름 에러:", error);
            
            // Axios 에러 처리 (interceptor에서 정규화된 형태 반영)
            const errorMessage = error.message || "네트워크 오류가 발생했습니다.";
            alert(`오류가 발생했습니다: ${errorMessage}`);
        }
    };

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(e.target.files);
            e.target.value = null;
        }
    };

    const removeImage = (idToRemove) => {
        setImages(prev => {
            const imageToRemove = prev.find(img => img.id === idToRemove);
            if (imageToRemove) {
                URL.revokeObjectURL(imageToRemove.preview);
            }
            return prev.filter(img => img.id !== idToRemove);
        });
    };

    const removeAllImages = () => {
        images.forEach(img => URL.revokeObjectURL(img.preview));
        setImages([]);
    };

    const placeholderSvg = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%271280%27%20height%3D%27800%27%20viewBox%3D%270%200%201280%20800%27%3E%0A%20%20%20%20%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20fill%3D%27%23ECE7DD%27/%3E%0A%20%20%20%20%3Crect%20x%3D%2760%27%20y%3D%2760%27%20width%3D%271160%27%20height%3D%27680%27%20rx%3D%2732%27%20fill%3D%27white%27%20stroke%3D%27%23E7E2D9%27%20stroke-width%3D%274%27/%3E%0A%20%20%20%20%3Ctext%20x%3D%27640%27%20y%3D%27360%27%20text-anchor%3D%27middle%27%20font-family%3D%27Pretendard%2CNoto%20Sans%20KR%2Csans-serif%27%20font-size%3D%2764%27%20font-weight%3D%27700%27%20fill%3D%27%235FAE7B%27%3E%EC%9A%94%EB%A6%AC%20%ED%9B%84%EA%B8%B0%20%EC%9D%B4%EB%AF%B8%EC%A7%80%3C/text%3E%0A%20%20%20%20%3Ctext%20x%3D%27640%27%20y%3D%27430%27%20text-anchor%3D%27middle%27%20font-family%3D%27Pretendard%2CNoto%20Sans%20KR%2Csans-serif%27%20font-size%3D%2728%27%20fill%3D%27%237A847D%27%3E%EC%A7%81%EC%A0%91%20%EB%A7%8C%EB%93%A0%20%EA%B8%B0%EB%A1%9D%3C/text%3E%0A%20%20%20%20%3C/svg%3E";

    return (
        <main className="w-full">
            <Section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                    {/* 후기 작성 폼 (생략 없이 유지) */}
                    <Card style={{ margin: 0, padding: '24px' }}>
                        <h1 className="text-xl font-bold mb-2">후기 작성</h1>
                        <p className="text-sm text-[var(--text-sub)] mb-5">
                            직접 만든 요리를 기록으로 남겨보세요. 북마크한 레시피 선택, 이미지 업로드, 후기 등록 흐름을 포함합니다.
                        </p>

                        <div className="flex flex-col gap-2 mb-4">
                            <label className="text-sm font-bold">북마크한 레시피 선택</label>
                            <select
                                className="w-full min-h-[46px] px-4 border border-[var(--border)] rounded-xl bg-white focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)] focus:ring-opacity-15 transition"
                                value={recipe}
                                onChange={(e) => setRecipe(e.target.value)}
                            >
                                {/* value에 DB의 실제 recipe_id 숫자가 필요함 */}
                                <option value="1">부추전</option>
                                <option value="2">감자채 볶음</option>
                                <option value="3">된장찌개</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2 mb-4">
                            <label className="text-sm font-bold">제목</label>
                            <InputText
                                variant="secondary"
                                is_full="true"
                                placeholder="후기 제목을 입력하세요"
                                getText={setTitle}
                                setText={title}
                            />
                        </div>

                        <div className="flex flex-col gap-2 mb-4">
                            <label className="text-sm font-bold">후기 내용</label>
                            <textarea
                                className="w-full min-h-[140px] p-4 border border-[var(--border)] rounded-xl bg-white focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)] focus:ring-opacity-15 transition resize-y"
                                placeholder="직접 만들어본 후기를 남겨보세요"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            >
                            </textarea>
                        </div>

                        <div className="flex flex-col gap-2 mb-4">
                            <div className="flex justify-between items-end mb-2">
                                <label className="text-sm font-bold">이미지 업로드 (최대 5장)</label>
                                <span className="text-gray-400 font-normal text-xs">jpg, png, webp</span>
                            </div>
                            <div
                                className={`w-full flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200 ease-in-out ${isDragActive ? 'border-[var(--primary)] bg-[var(--color-primary-light)]' : 'border-[var(--border)] hover:bg-gray-50'
                                    }`}
                                style={{ minHeight: '120px' }}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <span className="text-[var(--text-sub)] mb-2 font-medium">여기로 이미지를 드래그하거나 클릭하세요</span>
                                <span className="text-[var(--text-sub)] opacity-70 text-sm">한 번에 여러 장 선택 가능합니다</span>
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
                            <Button variant="primary" handleClick={handleSubmit}>후기 등록</Button>
                            <Button variant="secondary" handleClick={removeAllImages}>전체 이미지 제거</Button>
                        </div>
                    </Card>

                    {/* 업로드 미리보기 (생략 없이 유지) */}
                    <Card style={{ margin: 0, padding: '24px' }}>
                        <h2 className="text-xl font-bold mb-4">
                            업로드 미리보기 <span className="text-sm font-normal text-[var(--text-sub)]">({images.length}/5)</span>
                        </h2>

                        {images.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                                {images.map((img) => (
                                    <div key={img.id} className="relative overflow-hidden rounded-xl bg-[var(--soft-bg)] aspect-square border border-[var(--border)] group shadow-sm transition-transform hover:scale-[1.02]">
                                        <img className="w-full h-full object-cover" src={img.preview} alt="미리보기" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(img.id)}
                                            className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md font-bold"
                                            title="이미지 삭제"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-xl border border-[var(--border)] mb-4 opacity-70 aspect-[16/10]">
                                <img
                                    className="w-full h-full object-cover"
                                    src={placeholderSvg}
                                    alt="후기 이미지 예시"
                                />
                            </div>
                        )}

                        <p className="text-sm text-[var(--text-sub)] mb-4">
                            게시글 이미지는 최대 5장까지 허용하는 문서 기준을 반영한 예시 영역입니다. (드래그 앤 드롭 지원)
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <CustomTag variant="secondary">UUID 파일명 저장</CustomTag>
                            <CustomTag variant="secondary">Local/NFS 대응</CustomTag>
                            <CustomTag color="success">jpg/png/webp</CustomTag>
                        </div>
                    </Card>
                </div>

                {/* 최근 후기 목록 섹션 (생략 없이 유지) */}
                <div className="flex items-end justify-between gap-4 mb-5 px-2">
                    <div>
                        <h2 className="text-2xl font-bold m-0">최근 후기</h2>
                        <p className="text-[var(--text-sub)] mt-2 m-0">현재 공개 사이트의 소셜 화면처럼 작성 폼과 목록을 한 페이지에 함께 배치했습니다.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <PostCard
                        title="부추전 성공!"
                        author="test3"
                        date="2026-04-22 08:15"
                        category="부추전"
                        desc="레시피대로 했더니 정말 간단하게 완성됐어요. 청양고추를 추가하니 더 맛있었습니다."
                        imageSrc={placeholderSvg}
                    />
                    <PostCard
                        title="된장찌개 끓였어요"
                        author="caligo"
                        date="2026-04-21 19:42"
                        category="된장찌개"
                        desc="집에 있던 두부와 애호박으로 금방 만들 수 있었습니다. 부족했던 대파는 링크 타고 장봤어요."
                    />
                </div>
            </Section>
        </main>
    );
}