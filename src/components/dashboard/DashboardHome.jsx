export default function DashboardHome() {
  return (
    <div className="layout-container">
      <div className="flash-wrap">
        <div className="flash-message flash-info">
          오늘 유통기한 임박 재료가 3개 있습니다. 먼저 확인해보세요.
        </div>
        <div className="flash-message flash-success">
          보유 재료 기준으로 바로 만들 수 있는 레시피 12개를 찾았습니다.
        </div>
      </div>

      <section className="section-block">
        <div className="hero-layout">
          <div className="card-box hero-panel">
            <span className="hero-eyebrow">냉장고 재고 기반 생활형 추천 서비스</span>
            <h1 className="hero-title">
              지금 가진 재료로
              <br />
              오늘의 메뉴를 빠르게 정합니다.
            </h1>
            <p className="hero-text">
              오늘냉장고는 보유 재료, 유통기한, 사용자 조건을 기준으로 레시피를 추천하고,
              부족한 재료는 외부 쇼핑 링크로 바로 이어주는 구조를 가집니다.
            </p>
            <div className="hero-actions" style={{ marginTop: 14 }}>
              <button type="button" className="btn btn-secondary">
                이미지로 재료 등록
              </button>
              <button type="button" className="btn btn-outline">
                내 냉장고 보기
              </button>
            </div>
          </div>

          <div className="card-box hero-panel">
            <h1 className="hero-title">레시피 빠른 검색</h1>
            <div className="search-bar" aria-label="레시피 통합 검색">
              <input
                className="form-input"
                type="text"
                placeholder="예: 양배추랑 두부로 다이어트용 레시피 추천해줘"
              />
              <button type="button" className="btn btn-primary">
                추천 받기
              </button>
            </div>
            <p className="hero-text">
              회원님의 냉장고 재료와 입력하신 재료를 합쳐서 최적의 레시피를 찾습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-head">
          <div>
            <h2 className="section-title">홈 대시보드 요약</h2>
            <p className="section-desc">
              보유 재료 수, 임박 재료 수, 추천 가능 메뉴 수를 한눈에 확인합니다.
            </p>
          </div>
          <div className="section-actions">
            <button type="button" className="btn btn-outline">
              대시보드 새로고침
            </button>
          </div>
        </div>
        <div className="stats-grid">
          <article className="card-box stats-card">
            <div className="stats-label">보유 재료 수</div>
            <div className="stats-value">28</div>
          </article>
          <article className="card-box stats-card">
            <div className="stats-label">유통기한 임박 재료</div>
            <div className="stats-value">3</div>
          </article>
          <article className="card-box stats-card">
            <div className="stats-label">추천 가능 메뉴 수</div>
            <div className="stats-value">12</div>
          </article>
        </div>
      </section>

      <section className="section-block" id="recommend">
        <div className="section-head">
          <div>
            <h2 className="section-title">맞춤 추천 레시피</h2>
            <p className="section-desc">
              보유 재료와 레시피 재료의 일치율이 높은 순서로 정렬한 예시입니다.
            </p>
          </div>
          <div className="section-actions">
            <button type="button" className="btn btn-outline">
              전체 추천 보기
            </button>
            <button type="button" className="btn btn-secondary">
              북마크만 보기
            </button>
          </div>
        </div>
        <div className="grid-3">
          {[
            {
              title: "양배추 두부볶음",
              match: 86,
              tags: ["다이어트", "15분"],
              desc: "보유 재료 6개 중 5개 활용 가능. 부족 재료는 참기름 1개입니다.",
            },
            {
              title: "감자 양파국",
              match: 78,
              tags: ["이유식", "20분"],
              desc: "보유 재료 활용도가 높고, 임박 재료인 감자를 먼저 사용할 수 있습니다.",
            },
            {
              title: "브로콜리 계란샐러드",
              match: 72,
              tags: ["저당", "10분"],
              desc: "브로콜리, 계란, 양파를 바로 활용할 수 있는 가벼운 한 끼 메뉴입니다.",
            },
          ].map((r) => (
            <article key={r.title} className="card-box recipe-card">
              <div className="recipe-thumb">
                <img
                  src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 400'><rect width='640' height='400' fill='%23ECE7DD'/><circle cx='150' cy='160' r='90' fill='%235FAE7B' fill-opacity='0.24'/><circle cx='470' cy='220' r='120' fill='%23F4A261' fill-opacity='0.25'/><rect x='120' y='120' width='400' height='160' rx='40' fill='%23FFFFFF'/></svg>"
                  alt=""
                />
              </div>
              <div className="recipe-info">
                <h3 className="recipe-title">{r.title}</h3>
                <div className="recipe-meta">
                  <span className="badge badge-success">일치율 {r.match}%</span>
                  {r.tags.map((t) => (
                    <span key={t} className="badge">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="progress-bar">
                  <div className="progress-value" style={{ width: `${r.match}%` }} />
                </div>
                <p className="card-desc">{r.desc}</p>
                <div className="recipe-actions">
                  <button type="button" className="btn btn-primary">
                    상세보기
                  </button>
                  <button type="button" className="btn btn-outline">
                    북마크
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block" id="community">
        <div className="section-head">
          <div>
            <h2 className="section-title">커뮤니티와 새 글 알림</h2>
            <p className="section-desc">
              후기 게시판, 팔로우 기반 새 글 알림, 좋아요/신고 진입 구조를 반영한 예시입니다.
            </p>
          </div>
          <div className="section-actions">
            <button type="button" className="btn btn-primary">
              후기 작성
            </button>
          </div>
        </div>
        <div className="grid-2">
          <div className="list-box">
            <article className="card-box post-card">
              <div className="post-header">
                <strong>양배추 두부볶음 만들어봤어요</strong>
                <span className="post-meta">2026-04-21</span>
              </div>
              <p className="card-desc">
                생각보다 재료가 적게 들어가서 좋았고, 임박 재료 정리용으로 괜찮았습니다.
              </p>
              <div className="tag-list" style={{ marginTop: 14 }}>
                <span className="badge">좋아요 18</span>
                <span className="badge">댓글 4</span>
                <span className="badge badge-warning">신고</span>
              </div>
            </article>
            <article className="card-box post-card">
              <div className="post-header">
                <strong>냉장고 털이용 감자국 후기</strong>
                <span className="post-meta">2026-04-20</span>
              </div>
              <p className="card-desc">
                임박 재료를 먼저 보여주는 구조 덕분에 뭐부터 써야 할지 빨리 판단할 수 있었습니다.
              </p>
              <div className="tag-list" style={{ marginTop: 14 }}>
                <span className="badge">좋아요 11</span>
                <span className="badge">댓글 2</span>
                <span className="badge badge-warning">신고</span>
              </div>
            </article>
          </div>
          <article className="card-box">
            <div className="card-body">
              <h3 className="card-title">팔로우 기반 새 글 알림</h3>
              <p className="card-desc">
                내가 팔로우한 작성자의 새 글을 메인에서도 확인할 수 있게 둔 예시입니다.
              </p>
              <div className="list-box" style={{ marginTop: 18 }}>
                {[
                  ["한수정님이 새 후기를 작성했습니다.", "브로콜리 계란샐러드 후기 · 5분 전"],
                  ["장민재님이 냉장고 정리 팁을 공유했습니다.", "감자/양파 보관 팁 · 30분 전"],
                  ["민예린님이 장보기 링크 활용 후기를 올렸습니다.", "쇼핑 링크 비교 후기 · 1시간 전"],
                ].map(([a, b]) => (
                  <div key={a} className="list-item">
                    <div className="list-item-main">
                      <strong>{a}</strong>
                      <span className="list-item-sub">{b}</span>
                    </div>
                    <button type="button" className="btn btn-outline">
                      읽음
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section-block">
        <div className="section-head">
          <div>
            <h2 className="section-title">빈 상태 예시</h2>
            <p className="section-desc">
              아직 데이터가 없을 때 팀원이 바로 가져다 쓸 수 있는 기본 표현입니다.
            </p>
          </div>
        </div>
        <div className="card-box empty-state">
          아직 등록된 북마크가 없습니다. 추천 레시피에서 마음에 드는 메뉴를 저장해보세요.
        </div>
      </section>
    </div>
  );
}
