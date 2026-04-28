"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

export default function CommunityDetailPage() {
    const router = useRouter();

    const placeholderSvg = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%271280%27%20height%3D%27800%27%20viewBox%3D%270%200%201280%20800%27%3E%0A%20%20%20%20%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20fill%3D%27%23ECE7DD%27/%3E%0A%20%20%20%20%3Crect%20x%3D%2760%27%20y%3D%2760%27%20width%3D%271160%27%20height%3D%27680%27%20rx%3D%2732%27%20fill%3D%27white%27%20stroke%3D%27%23E7E2D9%27%20stroke-width%3D%274%27/%3E%0A%20%20%20%20%3Ctext%20x%3D%27640%27%20y%3D%27360%27%20text-anchor%3D%27middle%27%20font-family%3D%27Pretendard%2CNoto%20Sans%20KR%2Csans-serif%27%20font-size%3D%2764%27%20font-weight%3D%27700%27%20fill%3D%27%235FAE7B%27%3E%EC%9A%94%EB%A6%AC%20%ED%9B%84%EA%B8%B0%20%EC%9D%B4%EB%AF%B8%EC%A7%80%3C/text%3E%0A%20%20%20%20%3Ctext%20x%3D%27640%27%20y%3D%27430%27%20text-anchor%3D%27middle%27%20font-family%3D%27Pretendard%2CNoto%20Sans%20KR%2Csans-serif%27%20font-size%3D%2728%27%20fill%3D%27%237A847D%27%3E%EC%A7%81%EC%A0%91%20%EB%A7%8C%EB%93%A0%20%EA%B8%B0%EB%A1%9D%3C/text%3E%0A%20%20%20%20%3C/svg%3E";

    return (
        <main className="w-full">
            <div className="layout-container py-8">
                {/* 메인 상세 정보 섹션 */}
                <section className="section-block mb-8">
                    <article className="card-box post-card">
                        <div className="post-header flex justify-between items-center mb-4">
                            <strong className="text-xl">부추전 성공!</strong>
                            <span className="post-meta">test3 · 2026-04-22 08:15 · 부추전</span>
                        </div>
                        
                        <div className="image-box image-rounded thumb-16-10 mb-5">
                            <img className="image-cover w-full h-full object-cover" src={placeholderSvg} alt="후기 상세 이미지" />
                        </div>
                        
                        <p className="card-desc mb-6 leading-relaxed">
                            레시피대로 했더니 정말 간단하게 완성됐어요. 냉장고에 남은 부추를 처리하기에 좋았고, 부족했던 청양고추는 쇼핑 링크를 눌러 바로 비교해볼 수 있어서 편했습니다.
                        </p>
                        
                        <div className="tag-list flex gap-2 mb-6">
                            <span className="badge badge-success">좋아요 18</span>
                            <span className="badge">댓글 없음</span>
                            <span className="badge">팔로우 가능</span>
                        </div>
                        
                        <div className="card-actions flex gap-2">
                            <button className="btn btn-primary" type="button">좋아요</button>
                            <button className="btn btn-outline" type="button">작성자 팔로우</button>
                            <button className="btn btn-outline" type="button">신고</button>
                            <button className="btn btn-secondary" type="button" onClick={() => router.push('/recipes')}>레시피 보기</button>
                        </div>
                    </article>
                </section>

                {/* 하단 연결 정보 섹션 */}
                <section className="section-block">
                    <div className="grid-2">
                        <article className="card-box">
                            <div className="card-body">
                                <h2 className="card-title text-lg mb-2">연결 레시피</h2>
                                <p className="card-desc mb-4">북마크한 레시피와 후기 게시글을 느슨하게 연결해 상세 이동이 가능합니다.</p>
                                <div className="card-actions">
                                    <button className="btn btn-primary" type="button">부추전 상세</button>
                                </div>
                            </div>
                        </article>
                        
                        <article className="card-box">
                            <div className="card-body">
                                <h2 className="card-title text-lg mb-2">후기 작성자</h2>
                                <p className="card-desc mb-4">test3 님을 팔로우하면 새 글 알림 목록에서 후속 게시글을 확인할 수 있습니다.</p>
                                <div className="card-actions">
                                    <button className="btn btn-outline" type="button">알림 보기</button>
                                </div>
                            </div>
                        </article>
                    </div>
                </section>
            </div>
        </main>
    );
}