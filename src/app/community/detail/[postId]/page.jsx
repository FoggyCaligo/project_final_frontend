"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getPostDetail, deletePost } from '@/api/postApi';

export default function CommunityDetailPage() {
    const { postId } = useParams();
    const router = useRouter();
    const [post, setPost] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // 💡 현재 이미지 인덱스 상태 추가

    const currentUserId = 1; // 실제 서비스 시 세션/토큰에서 가져옴

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const data = await getPostDetail(postId);
                setPost(data);
            } catch (error) {
                console.error("게시글 로드 실패:", error);
            }
        };
        fetchDetail();
    }, [postId]);

    const handleDelete = async () => {
        if (confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
            await deletePost(postId);
            alert("삭제되었습니다.");
            router.push('/community');
        }
    };

    if (!post) return <div className="p-10 text-center">로딩 중...</div>;

    const isAuthor = post.authorUserId === currentUserId;
    
    // 💡 이미지 배열 및 다중 이미지 여부 확인
    const images = post.images || [];
    const hasMultipleImages = images.length > 1;

    // 💡 이전/다음 이미지 핸들러
    const handlePrev = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <main className="layout-container py-8">
            <article className="card-box post-card">
                <div className="post-header flex justify-between items-center mb-4">
                    <strong className="text-xl">{post.title}</strong>
                    <span className="post-meta">{post.authorLoginId} · {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                
                {/* 💡 이미지 렌더링 (슬라이더 기능 추가) */}
                {/* 기존 클래스를 유지하면서 relative와 group 클래스를 추가해 버튼을 오버레이합니다. */}
                <div className="image-box image-rounded thumb-16-10 mb-5 relative group">
                    <img 
                        className="image-cover w-full h-full object-cover transition-all duration-300" 
                        src={images[currentImageIndex] ? `http://43.201.1.45/uploads/community/${images[currentImageIndex].storedName}` : "/placeholder.svg"} 
                        alt={`상세 이미지 ${currentImageIndex + 1}`} 
                    />

                    {/* 이미지가 2개 이상일 때만 컨트롤 노출 */}
                    {hasMultipleImages && (
                        <>
                            {/* 이전 버튼 */}
                            <button 
                                onClick={handlePrev}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-black/70 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            
                            {/* 다음 버튼 */}
                            <button 
                                onClick={handleNext}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-black/70 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            {/* 하단 인디케이터 (현재 사진 위치) */}
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {images.map((_, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
                
                <p className="card-desc mb-6 whitespace-pre-wrap">{post.content}</p>
                
                <div className="card-actions flex gap-2">
                    {isAuthor ? (
                        <>
                            <button className="btn btn-outline" onClick={() => router.push(`/community/edit/${postId}`)}>수정</button>
                            <button className="btn btn-danger" onClick={handleDelete}>삭제</button>
                        </>
                    ) : (
                        <>
                            <button className="btn btn-primary">좋아요</button>
                            <button className="btn btn-outline">팔로우</button>
                            <button className="btn btn-outline">신고하기</button>
                        </>
                    )}
                    {post.recipeId && (
                        <button className="btn btn-secondary" onClick={() => router.push(`/recipes/${post.recipeId}`)}>레시피 보기</button>
                    )}
                </div>
            </article>
        </main>
    );
}