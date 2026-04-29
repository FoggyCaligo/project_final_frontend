"use client";
import React, { useState, useEffect } from 'react';
import PostCard from './components/PostCard';
import { getAllPosts } from '@/api/postApi'; // 💡 전체 게시글 조회 API 임포트

export default function CommunityPage() {
    const [posts, setPosts] = useState([]);

    // 💡 컴포넌트 마운트 시 전체 게시글 데이터 불러오기
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getAllPosts();
                setPosts(data);
            } catch (error) {
                console.error("게시글 목록을 불러오지 못했습니다.", error);
            }
        };

        fetchPosts();
    }, []);

    const placeholderSvg = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%271280%27%20height%3D%27800%27%20viewBox%3D%270%200%201280%20800%27%3E%0A%20%20%20%20%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20fill%3D%27%23ECE7DD%27/%3E%0A%20%20%20%20%3Crect%20x%3D%2760%27%20y%3D%2760%27%20width%3D%271160%27%20height%3D%27680%27%20rx%3D%2732%27%20fill%3D%27white%27%20stroke%3D%27%23E7E2D9%27%20stroke-width%3D%274%27/%3E%0A%20%20%20%20%3Ctext%20x%3D%27640%27%20y%3D%27360%27%20text-anchor%3D%27middle%27%20font-family%3D%27Pretendard%2CNoto%20Sans%20KR%2Csans-serif%27%20font-size%3D%2764%27%20font-weight%3D%27700%27%20fill%3D%27%235FAE7B%27%3E%EC%9A%94%EB%A6%AC%20%ED%9B%84%EA%B8%B0%20%EC%9D%B4%EB%AF%B8%EC%A7%80%3C/text%3E%0A%20%20%20%20%3Ctext%20x%3D%27640%27%20y%3D%27430%27%20text-anchor%3D%27middle%27%20font-family%3D%27Pretendard%2CNoto%20Sans%20KR%2Csans-serif%27%20font-size%3D%2728%27%20fill%3D%27%237A847D%27%3E%EC%A7%81%EC%A0%91%20%EB%A7%8C%EB%93%A0%20%EA%B8%B0%EB%A1%9D%3C/text%3E%0A%20%20%20%20%3C/svg%3E";

    // 💡 이미지 경로 생성 함수
    const getImageUrl = (storagePath, storedName) => {
        if (!storedName) return placeholderSvg;
        return `http://43.201.1.45/uploads/community/${storedName}`;
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
                        {/* 💡 백엔드에서 받아온 데이터 배열을 순회하며 PostCard 렌더링 */}
                        {posts.length > 0 ? (
                            posts.map((post, index) => (
                                <PostCard 
                                    key={index}
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
                </section>
            </div>
        </main>
    );
}