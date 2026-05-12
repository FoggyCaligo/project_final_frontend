function getInitial(nickname) {
  return (nickname || "유저").trim().slice(0, 1).toUpperCase();
}

function statusLabel(status) {
  if (status === "ACTIVE") {
    return "활성 회원";
  }

  if (status === "PENDING_VERIFICATION") {
    return "이메일 인증 대기";
  }

  return status || "상태 확인 필요";
}

function emailVerifiedBadge(emailVerified) {
  if (emailVerified === true) {
    return { className: "badge-success", label: "이메일 인증 완료" };
  }

  if (emailVerified === false) {
    return { className: "badge-warning", label: "이메일 인증 확인 필요" };
  }

  return { className: "", label: "이메일 인증 정보 없음" };
}

export default function ProfileCard({ profile, loading, onRefresh }) {
  const safeProfile = profile ?? {};
  const nickname = loading ? "불러오는 중" : safeProfile.nickname;
  const loginId = loading ? "-" : safeProfile.loginId;
  const hasProfileImage = Boolean(safeProfile.profileImageUrl);
  const emailBadge = emailVerifiedBadge(safeProfile.emailVerified);

  return (
    <article className="card-box">
      <div className="card-body">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div
              aria-label={`${safeProfile.nickname ?? "회원"} 프로필`}
              className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-primary-light)] bg-cover bg-center text-3xl font-extrabold text-[var(--color-primary)]"
              role="img"
              style={
                hasProfileImage
                  ? { backgroundImage: `url(${safeProfile.profileImageUrl})` }
                  : undefined
              }
            >
              {!hasProfileImage && getInitial(safeProfile.nickname)}
            </div>
            <div className="min-w-0">
              <span className="badge badge-success">회원 정보</span>
              <h2 className="mt-3 truncate text-3xl font-extrabold text-[var(--color-text)]">
                {nickname}
              </h2>
              <p className="card-desc mt-1 truncate">{loginId}</p>
            </div>
          </div>

          <button className="btn btn-outline" type="button" onClick={onRefresh}>
            새로고침
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-[var(--color-border)] p-4">
            <p className="text-sm font-bold text-[var(--color-text-sub)]">이메일</p>
            <p className="mt-1 truncate font-bold text-[var(--color-text)]">
              {loading ? "-" : safeProfile.email || "이메일 정보 없음"}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] p-4">
            <p className="text-sm font-bold text-[var(--color-text-sub)]">계정 상태</p>
            <div className="tag-list mt-2">
              <span className="badge">{loading ? "-" : statusLabel(safeProfile.status)}</span>
              <span className={`badge ${emailBadge.className}`}>
                {loading ? "-" : emailBadge.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
