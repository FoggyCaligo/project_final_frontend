"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getPostDetail, deletePost, addPostLike, removePostLike, getPostLikeStatus, addPostReport, getPostReportStatus } from '@/api/postApi';
import { addBookmark, removeBookmark, checkBookmarkStatus } from '@/api/bookmarkApi';

export default function CommunityDetailPage() {
    const { postId } = useParams();
    const router = useRouter();
    const [post, setPost] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0); 
    
    // 북마크, 좋아요 상태
    const [isBookmarked, setIsBookmarked] = useState(false); 
    const [isBookmarkLoading, setIsBookmarkLoading] = useState(false); 
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isLikeLoading, setIsLikeLoading] = useState(false);

    // 💡 신고 상태 추가
    const [isReported, setIsReported] = useState(false);
    const [isReportLoading, setIsReportLoading] = useState(false);

    // 테스트용 현재 유저 ID
    const currentUserId = 2;

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const data = await getPostDetail(postId);
                setPost(data);
                
                if (data.recipeId && data.authorUserId !== currentUserId) {
                    const statusData = await checkBookmarkStatus(currentUserId, data.recipeId);
                    setIsBookmarked(statusData.isBookmarked);
                }

                const likeData = await getPostLikeStatus(postId, currentUserId);
                setIsLiked(likeData.isLiked);
                const fetchedCount = likeData.likeCount ?? likeData.like_count ?? 0;
                setLikeCount(Number(fetchedCount));

                // 💡 상세 페이지 로드 시 신고 여부 확인
                if (data.authorUserId !== currentUserId) {
                    const reportData = await getPostReportStatus(postId, currentUserId);
                    setIsReported(reportData.isReported);
                }

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

    // 💡 신고 토글 핸들러 구현
    const handleReport = async () => {
        // 요구사항 3: 이미 신고한 경우 alert 후 종료
        if (isReported) {
            alert("이미 검토중인 글입니다.");
            return;
        }

        if (isReportLoading) return;

        // 요구사항 1: 컨펌 창 띄우기
        if (confirm("정말 이 게시글을 신고하시겠습니까?")) {
            setIsReportLoading(true);
            try {
                await addPostReport(postId, currentUserId);
                setIsReported(true);
                alert("신고가 접수되었습니다.");
                // 요구사항 2: 목록 페이지로 리다이렉트
                router.push('/community');
            } catch (error) {
                console.error("신고 처리 실패:", error);
                alert("신고 처리에 실패했습니다.");
            } finally {
                setIsReportLoading(false);
            }
        }
    };

    const handleBookmarkToggle = async () => { /* 기존 코드 동일 */
        if (!post.recipeId || isBookmarkLoading) return;
        setIsBookmarkLoading(true);
        try {
            if (isBookmarked) {
                await removeBookmark(currentUserId, post.recipeId);
                setIsBookmarked(false);
            } else {
                await addBookmark(currentUserId, post.recipeId);
                setIsBookmarked(true);
            }
        } catch (error) {
            console.error("북마크 처리 실패:", error);
        } finally {
            setIsBookmarkLoading(false);
        }
    };

    const handleLikeToggle = async () => { /* 기존 코드 동일 */
        if (isLikeLoading) return;
        setIsLikeLoading(true);
        setIsLiked(!isLiked);
        setLikeCount(prev => {
            const current = Number(prev) || 0; 
            return isLiked ? Math.max(0, current - 1) : current + 1;
        });

        try {
            if (isLiked) {
                await removePostLike(postId, currentUserId);
            } else {
                await addPostLike(postId, currentUserId);
            }
        } catch (error) {
            setIsLiked(isLiked);
            setLikeCount(prev => {
                const current = Number(prev) || 0;
                return isLiked ? current + 1 : Math.max(0, current - 1);
            });
            alert("좋아요 처리에 실패했습니다.");
        } finally {
            setIsLikeLoading(false);
        }
    };

    if (!post) return <div className="p-10 text-center">로딩 중...</div>;

    const isAuthor = post.authorUserId === currentUserId;
    const images = post.images || [];
    const hasMultipleImages = images.length > 1;

    const handlePrev = () => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    const handleNext = () => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

    return (
        <main className="layout-container py-8">
            <article className="card-box post-card">
                <div className="post-header flex justify-between items-center mb-4">
                    <strong className="text-xl">{post.title}</strong>
                    <span className="post-meta">{post.authorLoginId} · {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="image-box image-rounded thumb-16-10 mb-5 relative group">
                    <img 
                        className="image-cover w-full h-full object-cover transition-all duration-300" 
                        src={images[currentImageIndex] ? `http://43.201.1.45/uploads/community/${images[currentImageIndex].storedName}` : "/placeholder.svg"} 
                        alt={`상세 이미지 ${currentImageIndex + 1}`} 
                    />
                    {hasMultipleImages && (
                        <>
                            <button onClick={handlePrev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-black/70 text-white rounded-full transition-all opacity-0 group-hover:opacity-100">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button onClick={handleNext} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-black/70 text-white rounded-full transition-all opacity-0 group-hover:opacity-100">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                            </button>
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {images.map((_, idx) => (
                                    <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
                
                <p className="card-desc mb-6 whitespace-pre-wrap">{post.content}</p>
                
                <div className="card-actions flex justify-between items-center w-full mt-6">
                    <div className="flex flex-wrap gap-2">
                        {isAuthor ? (
                            <>
                                <button className="btn btn-outline flex items-center gap-1.5" onClick={() => router.push(`/community/edit/${postId}`)}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    수정
                                </button>
                                <button className="btn btn-danger flex items-center gap-1.5" onClick={handleDelete}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    삭제
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    className={`btn flex items-center gap-1.5 transition-all duration-300 active:scale-95 ${
                                        isLiked ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-md' : 'btn-outline'
                                    }`}
                                    onClick={handleLikeToggle}
                                    disabled={isLikeLoading}
                                >
                                    <svg 
                                        className={`w-4 h-4 transition-transform duration-300 ${isLiked ? 'scale-110 text-red-500' : ''}`} 
                                        fill={isLiked ? 'currentColor' : 'none'} 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    좋아요 {likeCount}
                                </button>

                                <button className="btn btn-outline flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                                    팔로우
                                </button>
                                
                                {post.recipeId && (
                                    <button 
                                        className={`btn flex items-center gap-1.5 transition-all duration-300 active:scale-95 ${isBookmarked ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-md' : 'btn-outline'}`}
                                        onClick={handleBookmarkToggle}
                                        disabled={isBookmarkLoading}
                                    >
                                        <svg className={`w-4 h-4 transition-transform duration-300 ${isBookmarked ? 'scale-110' : ''}`} fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                        </svg>
                                        {isBookmarked ? '북마크 됨' : '북마크'}
                                    </button>
                                )}
                            </>
                        )}
                        {post.recipeId && (
                            <button className="btn btn-secondary flex items-center gap-1.5" onClick={() => router.push(`/recipes/${post.recipeId}`)}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                레시피 보기
                            </button>
                        )}
                    </div>

                    {!isAuthor && (
                        // 💡 요구사항 반영된 신고하기 버튼
                        <button 
                            className={`btn flex items-center gap-1.5 transition-all ${
                                isReported 
                                    ? 'bg-gray-400 text-white border-gray-400 cursor-not-allowed' // 신고 완료 시 회색 비활성화 스타일
                                    : 'bg-red-500 text-white hover:bg-red-600 border-red-500 active:scale-95'
                            }`}
                            onClick={handleReport}
                            disabled={isReportLoading}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {isReported ? '신고됨' : '신고하기'}
                        </button>
                    )}
                </div>
            </article>
        </main>
    );
}