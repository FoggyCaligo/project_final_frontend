const summaryItems = [
  {
    key: "ingredientCount",
    label: "등록한 식재료",
    suffix: "개",
    tone: "success",
  },
  {
    key: "bookmarkCount",
    label: "북마크 레시피",
    suffix: "개",
    tone: "warning",
  },
  {
    key: "postCount",
    label: "작성한 후기",
    suffix: "개",
    tone: "danger",
  },
];

const toneClassMap = {
  success: "badge-success",
  warning: "badge-warning",
  danger: "badge-danger",
};

function displayValue(value, loading) {
  if (loading || value === null || value === undefined) {
    return "-";
  }

  return value;
}

export default function ActivitySummary({ activity, loading }) {
  return (
    <section className="section-block">
      <div className="section-head">
        <div>
          <h2 className="section-title">활동 요약</h2>
          <p className="section-desc">
            냉장고, 레시피, 커뮤니티 활동을 한눈에 확인합니다.
          </p>
        </div>
      </div>

      <div className="grid-3">
        {summaryItems.map((item) => (
          <article className="card-box" key={item.key}>
            <div className="card-body">
              <span className={`badge ${toneClassMap[item.tone] ?? ""}`}>{item.label}</span>
              <div className="mt-4 flex items-end gap-2">
                <strong className="text-4xl font-extrabold text-[var(--color-text)]">
                  {displayValue(activity[item.key], loading)}
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
