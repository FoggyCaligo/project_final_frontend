"use client";
import React, { useState, useEffect } from 'react';
import PostCard from './components/PostCard';
import Button from '@/components/ui/Button'; // 💡 페이지네이션 이전/다음 버튼을 위해 추가
import { getAllPosts } from '@/api/postApi';

export default function CommunityPage() {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // 💡 현재 페이지 (0부터 시작)
    const [totalPages, setTotalPages] = useState(0);   // 💡 전체 페이지 수
    const pageSize = 10; // 한 페이지당 표시할 개수

    // 💡 currentPage가 변경될 때마다 데이터를 다시 불러옵니다.
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // API 호출 시 현재 페이지와 페이지 사이즈를 넘겨줍니다.
                const data = await getAllPosts(currentPage, pageSize);
                
                // Spring Boot의 Page 객체는 실제 배열 데이터를 'content' 필드에 담아 보냅니다.
                // 만약 백엔드 변경이 덜 되어 배열이 통째로 온다면 data를 그대로 씁니다.
                setPosts(data.content || data); 
                setTotalPages(data.totalPages || 1);
            } catch (error) {
                console.error("게시글 목록을 불러오지 못했습니다.", error);
            }
        };

        fetchPosts();
    }, [currentPage]);

    const placeholderSvg = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%271280%27%20height%3D%27800%27%20viewBox%3D%270%200%201280%20800%27%3E%0A%20%20%20%20%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20fill%3D%27%23ECE7DD%27/%3E%0A%20%20%20%20%3Crect%20x%3D%2760%27%20y%3D%2760%27%20width%3D%271160%27%20height%3D%27680%27%20rx%3D%2732%27%20fill%3D%27white%27%20stroke%3D%27%23E7E2D9%27%20stroke-width%3D%274%27/%3E%0A%20%20%20%20%3Ctext%20x%3D%27640%27%20y%3D%27360%27%20text-anchor%3D%27middle%27%20font-family%3D%27Pretendard%2CNoto%20Sans%20KR%2Csans-serif%27%20font-size%3D%2764%27%20font-weight%3D%27700%27%20fill%3D%27%235FAE7B%27%3E%EC%9A%94%EB%A6%AC%20%ED%9B%84%EA%B8%B0%20%EC%9D%B4%EB%AF%B8%EC%A7%80%3C/text%3E%0A%20%20%20%20%3Ctext%20x%3D%27640%27%20y%3D%27430%27%20text-anchor%3D%27middle%27%20font-family%3D%27Pretendard%2CNoto%20Sans%20KR%2Csans-serif%27%20font-size%3D%2728%27%20fill%3D%27%237A847D%27%3E%EC%A7%81%EC%A0%91%20%EB%A7%8C%EB%93%A0%20%EA%B8%B0%EB%A1%9D%3C/text%3E%0A%20%20%20%20%3C/svg%3E";

    const getImageUrl = (storagePath, storedName) => {
        if (!storedName) return placeholderSvg;
        return `https://www.todayfridge.today/uploads/community/${storedName}`;
    };

    return (
        <main className="page-main">
            <div className="layout-container">
                <section className="section-block">
                    <div className="section-head">
                        <div>
                            <h2 className="section-title">요리 후기</h2>
                            <p className="section-desc">소셜 커뮤니티에서 회원들의 생생한 요리 후기를 만나보세요.</p>
                        </div>
                        <div className="section-actions">
                            <a className="btn btn-primary" href="/community/register">후기 작성하기</a>
                        </div>
                    </div>
                    
                    <div className="grid-2">
                        {posts.length > 0 ? (
                            posts.map((post, index) => (
                                <PostCard 
                                    key={post.postId || index}
                                    postId={post.postId}
                                    title={post.title}
                                    author={post.author}
                                    date={new Date(post.date).toLocaleString('ko-KR', {
                                        year: 'numeric', month: '2-digit', day: '2-digit',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                    desc={post.desc}
                                    imageSrc={getImageUrl(post.storagePath, post.storedName)}
                                />
                            ))
                        ) : (
                            <div className="col-span-1 md:col-span-2 text-center py-10 text-[var(--text-sub)] border border-dashed rounded-xl border-[var(--border)]">
                                등록된 후기가 없습니다. 첫 번째 후기의 주인공이 되어보세요!
                            </div>
                        )}
                    </div>

                    {/* 💡 페이지네이션 UI 시작 */}
                    {totalPages > 0 && (
                        <div className="flex justify-center items-center gap-2 mt-10">
                            {/* 이전 버튼 */}
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                                disabled={currentPage === 0}
                                className={`px-4 py-2 rounded-lg font-bold transition ${
                                    currentPage === 0 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white border border-[var(--border)] text-[var(--text-sub)] hover:bg-gray-50'
                                }`}
                            >
                                이전
                            </button>
                            
                            {/* 페이지 번호 버튼들 */}
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i)}
                                    className={`w-10 h-10 rounded-lg font-bold transition ${
                                        currentPage === i 
                                        ? 'bg-[var(--primary)] text-white shadow-sm' 
                                        : 'bg-white border border-[var(--border)] text-[var(--text-sub)] hover:bg-gray-50'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            {/* 다음 버튼 */}
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                                disabled={currentPage === totalPages - 1}
                                className={`px-4 py-2 rounded-lg font-bold transition ${
                                    currentPage === totalPages - 1 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white border border-[var(--border)] text-[var(--text-sub)] hover:bg-gray-50'
                                }`}
                            >
                                다음
                            </button>
                        </div>
                    )}
                    {/* 💡 페이지네이션 UI 끝 */}
                </section>
            </div>
        </main>
    );
}