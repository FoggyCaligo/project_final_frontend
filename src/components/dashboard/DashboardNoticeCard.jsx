import Link from "next/link";

const toneClassMap = {
    success: "badge-success",
    warning: "badge-warning",
    danger: "badge-danger",
};

const fallbackLabelMap = {
    danger: "주의",
    warning: "확인",
    success: "안내",
    info: "안내",
};

export default function DashboardNoticeCard({ notices }) {
    return (
        <article className="card-box">
            <div className="card-body">
                <h2 className="card-title">안내 및 알림</h2>
                <p className="card-desc">
                    냉장고 상태와 추천 결과를 기준으로 지금 확인할 항목을 보여줍니다.
                </p>

                <div className="mt-5 flex flex-col gap-3">
                    {notices.map((notice) => (
                        <div
                            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-soft)] p-4"
                            key={notice.id}
                        >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                    <span className={`badge ${toneClassMap[notice.tone] ?? ""}`}>
                                        {notice.label ?? fallbackLabelMap[notice.tone] ?? "안내"}
                                    </span>
                                    <strong className="mt-3 block text-[var(--color-text)]">
                                        {notice.title}
                                    </strong>
                                    <p className="card-desc mt-2 text-sm">{notice.message}</p>
                                </div>

                                {notice.href && notice.actionLabel && (
                                    <Link
                                        className="btn btn-outline shrink-0 px-4 py-2 text-sm"
                                        href={notice.href}
                                    >
                                        {notice.actionLabel}
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </article>
    );
}
