/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import styles from "./Dashboard.module.css";

export default function DashboardRecipeCard({ recipes, loading }) {
  return (
    <article className={`${styles.recipeCard} card-box`}>
      <div className="card-body">
        <div className={`section-head mb-0 ${styles.sectionHead}`}>
          <div className="min-w-0">
            <h2 className="card-title">맞춤 추천 레시피</h2>
            <p className="card-desc">
              추천 API에서 받은 결과를 대시보드에 일부 노출합니다.
            </p>
          </div>
          <Link className="btn btn-outline shrink-0" href="/recommendations">
            전체 보기
          </Link>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {loading && (
            <div className="card-box p-4 text-sm text-[var(--color-text-sub)]">
              추천 레시피를 불러오는 중입니다.
            </div>
          )}

          {!loading && recipes.length === 0 && (
            <div className="card-box p-4 text-sm text-[var(--color-text-sub)]">
              추천 결과가 없습니다.
            </div>
          )}

          {!loading &&
            recipes.map((recipe) => (
              <Link
                className={`${styles.recipeItem} card-box transition hover:-translate-y-0.5`}
                href={`/recipes/${recipe.id}`}
                key={recipe.id}
              >
                <div className={styles.recipeThumb}>
                  <img
                    className="image-cover"
                    src={recipe.thumbnailUrl || "/next.svg"}
                    alt={recipe.title}
                  />
                </div>

                <div className={styles.recipeContent}>
                  <div className="flex flex-wrap gap-2">
                    {typeof recipe.matchRate === "number" && (
                      <span className="badge badge-success">일치율 {recipe.matchRate}%</span>
                    )}
                    <span className="badge">{recipe.cookTime}</span>
                    <span className="badge">{recipe.difficulty}</span>
                  </div>
                  <h3 className="mt-3 truncate text-lg font-extrabold text-[var(--color-text)]">
                    {recipe.title}
                  </h3>
                  {recipe.reason && (
                    <p className="card-desc mt-2 line-clamp-2 text-sm">
                      {recipe.reason}
                    </p>
                  )}
                </div>
              </Link>
            ))}
        </div>
      </div>
    </article>
  );
}
