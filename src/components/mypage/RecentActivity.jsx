import Link from "next/link";

function getTitle(item) {
  return item?.title ?? "표시할 항목이 없습니다.";
}

function LoadingState() {
  return (
    <div className="rounded-xl border border-[var(--color-border)] p-5 text-sm font-semibold text-[var(--color-text-sub)]">
      활동 내역을 불러오는 중입니다.
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--color-border)] p-5 text-sm font-semibold text-[var(--color-text-sub)]">
      아직 표시할 {label} 없습니다.
    </div>
  );
}

export default function RecentActivity({ recentPosts, bookmarkedRecipes, loading }) {
  const posts = loading ? [] : recentPosts.slice(0, 3);
  const recipes = loading ? [] : bookmarkedRecipes.slice(0, 3);

  return (
    <section className="section-block">
      <div className="grid-2">
        <article className="card-box">
          <div className="card-body">
            <h2 className="card-title">최근 작성 후기</h2>
            <div className="mt-5 flex flex-col gap-3">
              {loading ? (
                <LoadingState />
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <Link
                    className="rounded-xl border border-[var(--color-border)] p-4 transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]"
                    href={post.id ? `/community/detail/${post.id}` : "/community"}
                    key={post.id ?? post.title}
                  >
                    <strong className="line-clamp-1 text-[var(--color-text)]">{getTitle(post)}</strong>
                    <p className="card-desc mt-1 text-sm">커뮤니티 후기</p>
                  </Link>
                ))
              ) : (
                <EmptyState label="후기가" />
              )}
            </div>
          </div>
        </article>

        <article className="card-box">
          <div className="card-body">
            <h2 className="card-title">북마크 레시피</h2>
            <div className="mt-5 flex flex-col gap-3">
              {loading ? (
                <LoadingState />
              ) : recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <Link
                    className="rounded-xl border border-[var(--color-border)] p-4 transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]"
                    href={recipe.id ? `/recipes/${recipe.id}` : "/recipes"}
                    key={recipe.id ?? recipe.title}
                  >
                    <strong className="line-clamp-1 text-[var(--color-text)]">{getTitle(recipe)}</strong>
                    <p className="card-desc mt-1 line-clamp-1 text-sm">
                      {recipe.summary || "저장한 레시피"}
                    </p>
                  </Link>
                ))
              ) : (
                <EmptyState label="레시피가" />
              )}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
