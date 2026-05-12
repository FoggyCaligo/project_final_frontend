import Link from "next/link";
import styles from "./Dashboard.module.css";

export default function DashboardFridgeCard({ items, loading, totalCount = items.length }) {
    const hasHiddenItems = !loading && totalCount > items.length;

    return (
        <article className="card-box">
            <div className="card-body">
                <div className={`section-head mb-0 ${styles.sectionHead}`}>
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="card-title">유통기한 임박 재료</h2>
                            <span className="badge badge-warning">
                                {loading ? "확인 중" : `${totalCount}개`}
                            </span>
                        </div>
                        <p className="card-desc">
                            {hasHiddenItems
                                ? `먼저 처리할 ${items.length}개만 보여주고 나머지는 냉장고 관리에서 확인합니다.`
                                : "냉장고 DB에서 먼저 확인할 재료를 가져옵니다."}
                        </p>
                    </div>
                    <Link className="btn btn-secondary shrink-0 whitespace-nowrap" href="/fridge">
                        관리하기
                    </Link>
                </div>

                <div className="mt-5 flex max-h-[430px] flex-col gap-3 overflow-y-auto pr-1">
                    {loading && (
                        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-soft)] p-4 text-sm text-[var(--color-text-sub)]">
                            재료를 불러오는 중입니다.
                        </div>
                    )}

                    {!loading && items.length === 0 && (
                        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-soft)] p-4 text-sm text-[var(--color-text-sub)]">
                            임박 재료가 없습니다.
                        </div>
                    )}

                    {!loading &&
                        items.map((item) => (
                            <div
                                className="rounded-xl border border-[var(--color-border)] bg-white p-4"
                                key={item.id}
                            >
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div className="min-w-0">
                                        <strong className="block truncate text-lg">{item.name}</strong>
                                        <p className="card-desc text-sm">수량 {item.quantity}</p>
                                    </div>
                                    <span className="badge badge-warning shrink-0">{item.expiresIn}</span>
                                </div>
                            </div>
                        ))}

                    {hasHiddenItems && (
                        <Link
                            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-soft)] p-4 text-center text-sm font-extrabold text-[var(--color-primary)] transition hover:-translate-y-0.5"
                            href="/fridge"
                        >
                            전체 {totalCount}개 중 {items.length}개 표시 중 · 나머지 보기
                        </Link>
                    )}
                </div>
            </div>
        </article>
    );
}
