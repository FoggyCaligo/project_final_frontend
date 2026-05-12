import styles from "./Dashboard.module.css";

const toneClassMap = {
    success: "badge-success",
    warning: "badge-warning",
    danger: "badge-danger",
};

export default function DashboardSummaryCards({ items, loading }) {
    return (
        <section className="section-block">
            <div className={`section-head ${styles.sectionHead}`}>
                <div>
                    <h2 className="section-title">홈 대시보드 요약</h2>
                    <p className="section-desc">
                        냉장고 API와 추천 API에서 받은 주요 수치를 한눈에 확인합니다.
                    </p>
                </div>
            </div>

            <div className="grid-4">
                {items.map((item) => (
                    <article className="card-box" key={item.key}>
                        <div className="card-body">
                            <span className={`badge ${toneClassMap[item.tone] ?? ""}`}>
                                {item.label}
                            </span>
                            <div className="mt-4 flex items-end gap-2">
                                <strong className="text-4xl font-extrabold text-[var(--color-text)]">
                                    {loading ? "-" : item.value}
                                </strong>
                                <span className="pb-1 text-sm font-bold text-[var(--color-text-sub)]">
                                    {item.suffix}
                                </span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
