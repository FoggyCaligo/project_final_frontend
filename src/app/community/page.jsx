// src/app/community/page.jsx
import React from 'react';
import PostCard from './components/PostCard';

export default function CommunityPage() {
    return (
        <main className="page-main">
            <div className="layout-container">
                <section className="section-block">
                    <div className="section-head">
                        <div>
                            <h2 className="section-title">최근 후기</h2>
                            <p className="section-desc">소셜 커뮤니티에서 회원들의 생생한 요리 후기를 만나보세요.</p>
                        </div>
                        <div className="section-actions">
                            <a className="btn btn-primary" href="/community/register">후기 작성하기</a>
                        </div>
                    </div>
                    
                    <div className="grid-2">
                        <PostCard 
                            title="부추전 성공!"
                            author="test3"
                            date="2026-04-22 08:15"
                            category="부추전"
                            imageSrc="data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%271280%27%20height%3D%27800%27%20viewBox%3D%270%200%201280%20800%27%3E%0A%20%20%20%20%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20fill%3D%27%23ECE7DD%27/%3E%0A%20%20%20%20%3Crect%20x%3D%2760%27%20y%3D%2760%27%20width%3D%271160%27%20height%3D%27680%27%20rx%3D%2732%27%20fill%3D%27white%27%20stroke%3D%27%23E7E2D9%27%20stroke-width%3D%274%27/%3E%0A%20%20%20%20%3Ctext%20x%3D%27640%27%20y%3D%27360%27%20text-anchor%3D%27middle%27%20font-family%3D%27Pretendard%2CNoto%20Sans%20KR%2Csans-serif%27%20font-size%3D%2764%27%20font-weight%3D%27700%27%20fill%3D%27%235FAE7B%27%3E%EC%9A%94%EB%A6%AC%20%ED%9B%84%EA%B8%B0%20%EC%9D%B4%EB%AF%B8%EC%A7%80%3C/text%3E%0A%20%20%20%20%3Ctext%20x%3D%27640%27%20y%3D%27430%27%20text-anchor%3D%27middle%27%20font-family%3D%27Pretendard%2CNoto%20Sans%20KR%2Csans-serif%27%20font-size%3D%2728%27%20fill%3D%27%237A847D%27%3E%EC%A7%81%EC%A0%91%20%EB%A7%8C%EB%93%A0%20%EA%B8%B0%EB%A1%9D%3C/text%3E%0A%20%20%20%20%3C/svg%3E"
                            desc="레시피대로 했더니 정말 간단하게 완성됐어요. 청양고추를 추가하니 더 맛있었습니다."
                        />
                        <PostCard 
                            title="된장찌개 끓였어요"
                            author="caligo"
                            date="2026-04-21 19:42"
                            category="된장찌개"
                            desc="집에 있던 두부와 애호박으로 금방 만들 수 있었습니다. 부족했던 대파는 링크 타고 장봤어요."
                        />
                    </div>
                </section>
            </div>
        </main>
    );
}
