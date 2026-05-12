const toneClassMap = {
  danger: "dashboard-bar-danger",
  neutral: "dashboard-bar-neutral",
  success: "dashboard-bar-success",
  warning: "dashboard-bar-warning",
};

function MetricBar({ item }) {
  return (
    <div className="dashboard-metric-row">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-[var(--color-text)]">{item.label}</span>
        <span className="text-sm font-extrabold text-[var(--color-text-sub)]">{item.value}개</span>
      </div>
      <div className="dashboard-bar-track">
        <div
          className={`dashboard-bar-fill ${toneClassMap[item.tone] ?? toneClassMap.neutral}`}
          style={{ width: `${item.percent}%` }}
        />
      </div>
    </div>
  );
}

export default function DashboardInsightCard({ insights, loading }) {
  const overviewBars = insights?.overviewBars ?? [];
  const storageBreakdown = insights?.storageBreakdown ?? [];
  const tip = insights?.tip ?? null;

  return (
    <article className="card-box">
      <div className="card-body">
        <div className="section-head mb-0">
          <div>
            <h2 className="card-title">냉장고 상태 요약</h2>
            <p className="card-desc">
              냉장고 재료와 추천 결과를 기준으로 먼저 확인할 항목을 정리합니다.
            </p>
          </div>
        </div>

        {tip && (
          <div className="mt-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-soft)] p-4">
            <strong className="block text-[var(--color-text)]">{tip.title}</strong>
            <p className="card-desc mt-2 text-sm">{tip.description}</p>
          </div>
        )}

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h3 className="text-sm font-extrabold text-[var(--color-text)]">냉장고 활용 지표</h3>
            <div className="mt-3 flex flex-col gap-3">
              {overviewBars.map((item) => (
                <MetricBar item={loading ? { ...item, value: 0, percent: 0 } : item} key={item.key} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-[var(--color-text)]">보관 분포</h3>
            <div className="mt-3 flex flex-col gap-2">
              {storageBreakdown.map((item) => (
                <div
                  className="flex items-center justify-between rounded-xl border border-[var(--color-border)] px-3 py-2"
                  key={item.label}
                >
                  <span className="text-sm font-bold text-[var(--color-text-sub)]">{item.label}</span>
                  <span className="text-sm font-extrabold text-[var(--color-text)]">
                    {loading ? 0 : item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
