import Link from "next/link";

const priceFormatter = new Intl.NumberFormat("ko-KR");

function formatPrice(value) {
  if (!value) {
    return "-";
  }

  return `${priceFormatter.format(value)}원`;
}

export default function DashboardShoppingCard({ shopping, loading }) {
  const items = shopping?.items ?? [];
  const lowestItem = shopping?.lowestItem ?? null;

  return (
    <article className="card-box">
      <div className="card-body">
        <div className="section-head mb-0">
          <div>
            <h2 className="card-title">냉장고 최저가</h2>
            <p className="card-desc">
              백엔드 쇼핑 API에서 냉장고 식재료별 최저가를 받아옵니다.
            </p>
          </div>
          <Link className="btn btn-outline" href="/ingredients-price">
            전체 보기
          </Link>
        </div>

        <div className="mt-5 rounded-xl border border-[var(--color-border)] p-4">
          <p className="text-sm font-bold text-[var(--color-text-sub)]">조회된 식재료</p>
          <div className="mt-2 flex flex-wrap items-end gap-3">
            <strong className="text-3xl font-extrabold text-[var(--color-text)]">
              {loading ? "-" : shopping?.totalCount ?? 0}
            </strong>
            <span className="pb-1 text-sm font-bold text-[var(--color-text-sub)]">
              개 식재료 / 합계 {loading ? "-" : formatPrice(shopping?.totalLowestPrice)}
            </span>
          </div>
          {lowestItem && (
            <p className="card-desc mt-3 text-sm">
              가장 낮은 항목: {lowestItem.ingredientName} {formatPrice(lowestItem.lowestPrice)}
            </p>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {loading && (
            <div className="card-box p-4 text-sm text-[var(--color-text-sub)]">
              쇼핑 최저가를 불러오는 중입니다.
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="card-box p-4 text-sm text-[var(--color-text-sub)]">
              표시할 최저가 정보가 없습니다.
            </div>
          )}

          {!loading &&
            items.map((item) => {
              const content = (
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <strong className="block truncate text-[var(--color-text)]">
                      {item.ingredientName}
                    </strong>
                    <p className="card-desc mt-1 truncate text-sm">
                      {[item.mallName, item.productName].filter(Boolean).join(" · ") || "상품 정보 없음"}
                    </p>
                  </div>
                  <span className="shrink-0 font-extrabold text-[var(--color-primary)]">
                    {formatPrice(item.lowestPrice)}
                  </span>
                </div>
              );

              if (item.purchaseUrl) {
                return (
                  <a
                    className="card-box block p-4 transition hover:-translate-y-0.5"
                    href={item.purchaseUrl}
                    key={item.id}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <div className="card-box p-4" key={item.id}>
                  {content}
                </div>
              );
            })}
        </div>
      </div>
    </article>
  );
}
