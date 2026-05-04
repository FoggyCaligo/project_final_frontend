import Link from "next/link";

export default function DashboardHero({ loading, summaryCards, onRefresh }) {
    const totalIngredients = summaryCards.find((item) => item.key === "total")?.value ?? 0;
    const recommendedRecipes = summaryCards.find((item) => item.key === "recipes")?.value ?? 0;

    return (
        <section className="section-block">
            <div className="grid-2">
                <article className="card-box">
                    <div className="card-body">
                        <span className="badge badge-success">냉장고 재고 기반 생활형 추천 서비스</span>
                        <h1 className="mt-4 text-3xl font-extrabold leading-tight text-[var(--color-text)] md:text-4xl">
                            지금 가진 재료로 오늘의 메뉴를 빠르게 정합니다.
                        </h1>
                        <p className="card-desc mt-3">
                            DB에 저장된 냉장고 재료와 추천 레시피를 불러와 홈 대시보드에서
                            바로 확인할 수 있게 구성했습니다.
                        </p>
                        <div className="card-actions">
                            <Link className="btn btn-primary" href="/fridge">
                                내 냉장고 보기
                            </Link>
                            <Link className="btn btn-outline" href="/recommendations">
                                추천 레시피 보기
                            </Link>
                        </div>
                    </div>
                </article>

                <article className="card-box">
                    <div className="card-body">
                        <h2 className="card-title">오늘의 연결 상태</h2>
                        <p className="card-desc">
                            {loading
                                ? "냉장고와 추천 데이터를 불러오는 중입니다."
                                : `보유 재료 ${totalIngredients}개 기준으로 추천 가능 메뉴 ${recommendedRecipes}개를 확인했습니다.`}
                        </p>
                        <div className="card-actions">
                            <button className="btn btn-secondary" type="button" onClick={onRefresh}>
                                대시보드 새로고침
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        </section>
    );
}
