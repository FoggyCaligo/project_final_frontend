import React from 'react';

export default function CommunityRegisterPage() {
    return (
        <main className="page-main">
            <div className="layout-container">

                {/* 1. 후기 작성 폼 및 미리보기 섹션 */}
                <section className="section-block">
                    <div className="grid-2">

                        {/* 후기 작성 폼 */}
                        <article className="card-box">
                            <div className="card-body">
                                <h1 className="card-title">후기 작성</h1>
                                <p className="card-desc">
                                    직접 만든 요리를 기록으로 남겨보세요. 북마크한 레시피 선택, 이미지 업로드, 후기 등록 흐름을 포함합니다.
                                </p>

                                <div className="form-group mt-4">
                                    <label className="form-label">북마크한 레시피 선택</label>
                                    <select className="form-select">
                                        <option>부추전</option>
                                        <option>감자채 볶음</option>
                                        <option>된장찌개</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">제목</label>
                                    <input className="form-input" type="text" placeholder="후기 제목을 입력하세요" />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">후기 내용</label>
                                    <textarea className="form-textarea" placeholder="직접 만들어본 후기를 남겨보세요"></textarea>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">이미지 업로드</label>
                                    <input className="form-input" type="file" />
                                </div>

                                <div className="card-actions">
                                    <button className="btn btn-primary" type="button">후기 등록</button>
                                    <button className="btn btn-outline" type="button">이미지 제거</button>
                                </div>
                            </div>
                        </article>

                        {/* 업로드 미리보기 */}
                        <article className="card-box">
                            <div className="card-body">
                                <h2 className="card-title">업로드 미리보기</h2>
                                <div className="image-box image-rounded thumb-16-10 mb-4">
                                    <img
                                        className="image-cover"
                                        src="data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%271280%27%20height%3D%27800%27%20viewBox%3D%270%200%201280%20800%27%3E%0A%20%20%20%20%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20fill%3D%27%23ECE7DD%27/%3E%0A%20%20%20%20%3Crect%20x%3D%2760%27%20y%3D%2760%27%20width%3D%271160%27%20height%3D%27680%27%20rx%3D%2732%27%20fill%3D%27white%27%20stroke%3D%27%23E7E2D9%27%20stroke-width%3D%274%27/%3E%0A%20%20%20%20%3Ctext%20x%3D%27640%27%20y%3D%27360%27%20text-anchor%3D%27middle%27%20font-family%3D%27Pretendard%2CNoto%20Sans%20KR%2Csans-serif%27%20font-size%3D%2764%27%20font-weight%3D%27700%27%20fill%3D%27%235FAE7B%27%3E%EC%9A%94%EB%A6%AC%20%ED%9B%84%EA%B8%B0%20%EC%9D%B4%EB%AF%B8%EC%A7%80%3C/text%3E%0A%20%20%20%20%3Ctext%20x%3D%27640%27%20y%3D%27430%27%20text-anchor%3D%27middle%27%20font-family%3D%27Pretendard%2CNoto%20Sans%20KR%2Csans-serif%27%20font-size%3D%2728%27%20fill%3D%27%237A847D%27%3E%EC%A7%81%EC%A0%91%20%EB%A7%8C%EB%93%A0%20%EA%B8%B0%EB%A1%9D%3C/text%3E%0A%20%20%20%20%3C/svg%3E"
                                        alt="후기 이미지 예시"
                                    />
                                </div>
                                <p className="card-desc mb-4">
                                    게시글 이미지는 최대 5장까지 허용하는 문서 기준을 반영한 예시 영역입니다.
                                </p>
                                <div className="tag-list">
                                    <span className="badge">UUID 파일명 저장</span>
                                    <span className="badge">Local/NFS 대응</span>
                                    <span className="badge badge-success">jpg/png/webp</span>
                                </div>
                            </div>
                        </article>

                    </div>
                </section>

                {/* 2. 최근 후기 목록 섹션 */}
                <section className="section-block">
                    <div className="section-head">
                        <div>
                            <h2 className="section-title">최근 후기</h2>
                            <p className="section-desc">현재 공개 사이트의 소셜 화면처럼 작성 폼과 목록을 한 페이지에 함께 배치했습니다.</p>
                        </div>
                    </div>

                    <div className="grid-2">

                        {/* 후기 카드 1 */}
                        <article className="card-box post-card">
                            <div className="post-header">
                                <strong>부추전 성공!</strong>
                                <span className="post-meta">test3 · 2026-04-22 08:15 · 부추전</span>
                            </div>
                            <div className="image-box image-rounded thumb-16-10 mb-4">
                                <img
                                    className="image-cover"
                                    src="data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%271280%27%20height%3D%27800%27%20viewBox%3D%270%200%201280%20800%27%3E%0A%20%20%20%20%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20fill%3D%27%23ECE7DD%27/%3E%0A%20%20%20%20%3Crect%20x%3D%2760%27%20y%3D%2760%27%20width%3D%271160%27%20height%3D%27680%27%20rx%3D%2732%27%20fill%3D%27white%27%20stroke%3D%27%23E7E2D9%27%20stroke-width%3D%274%27/%3E%0A%20%20%20%20%3Ctext%20x%3D%27640%27%20y%3D%27360%27%20text-anchor%3D%27middle%27%20font-family%3D%27Pretendard%2CNoto%20Sans%20KR%2Csans-serif%27%20font-size%3D%2764%27%20font-weight%3D%27700%27%20fill%3D%27%235FAE7B%27%3E%EC%9A%94%EB%A6%AC%20%ED%9B%84%EA%B8%B0%20%EC%9D%B4%EB%AF%B8%EC%A7%80%3C/text%3E%0A%20%20%20%20%3Ctext%20x%3D%27640%27%20y%3D%27430%27%20text-anchor%3D%27middle%27%20font-family%3D%27Pretendard%2CNoto%20Sans%20KR%2Csans-serif%27%20font-size%3D%2728%27%20fill%3D%27%237A847D%27%3E%EC%A7%81%EC%A0%91%20%EB%A7%8C%EB%93%A0%20%EA%B8%B0%EB%A1%9D%3C/text%3E%0A%20%20%20%20%3C/svg%3E"
                                    alt="부추전 후기"
                                />
                            </div>
                            <p className="card-desc">
                                레시피대로 했더니 정말 간단하게 완성됐어요. 청양고추를 추가하니 더 맛있었습니다.
                            </p>
                            <div className="card-actions">
                                {/* Next.js에서는 <a> 대신 <Link> 태그 사용을 권장하지만, 일단 UI 구성을 위해 a 태그로 유지했습니다. */}
                                <a className="btn btn-primary" href="/community/detail">상세 보기</a>
                                <button className="btn btn-outline" type="button">좋아요</button>
                                <button className="btn btn-outline" type="button">신고</button>
                            </div>
                        </article>

                        {/* 후기 카드 2 */}
                        <article className="card-box post-card">
                            <div className="post-header">
                                <strong>된장찌개 끓였어요</strong>
                                <span className="post-meta">caligo · 2026-04-21 19:42 · 된장찌개</span>
                            </div>
                            <p className="card-desc">
                                집에 있던 두부와 애호박으로 금방 만들 수 있었습니다. 부족했던 대파는 링크 타고 장봤어요.
                            </p>
                            <div className="card-actions">
                                <a className="btn btn-primary" href="/community/detail">상세 보기</a>
                                <button className="btn btn-outline" type="button">좋아요</button>
                                <button className="btn btn-outline" type="button">신고</button>
                            </div>
                        </article>

                    </div>
                </section>

            </div>
        </main>
    );
}
