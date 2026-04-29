const toneClassMap = {
    success: "badge-success",
    warning: "badge-warning",
    danger: "badge-danger",
};

export default function DashboardNoticeCard({ notices }) {
    return (
        <article className="card-box">
            <div className="card-body">
                <h2 className="card-title">안내 및 알림</h2>
                <p className="card-desc">
                    API 호출 결과와 냉장고 상태를 기반으로 표시합니다.
                </p>

                <div className="mt-5 flex flex-col gap-3">
                    {notices.map((notice) => (
                        <div className="card-box p-4" key={notice.id}>
                            <span className={`badge ${toneClassMap[notice.tone] ?? ""}`}>
                                {notice.tone === "danger" ? "주의" : notice.tone === "warning" ? "확인" : "안내"}
                            </span>
                            <p className="card-desc mt-2 text-sm">{notice.message}</p>
                        </div>
                    ))}
                </div>
            </div>
        </article>
    );
}
