import Link from "next/link";
import { myPageQuickLinks } from "@/features/mypage/constants";

export default function QuickLinks() {
  return (
    <article className="card-box">
      <div className="card-body">
        <h2 className="card-title">빠른 이동</h2>
        <p className="card-desc">마이페이지에서 자주 이어지는 화면입니다.</p>

        <div className="mt-5 flex flex-col gap-3">
          {myPageQuickLinks.map((link) => (
            <Link
              className="flex items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] p-4 transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]"
              href={link.href}
              key={link.id}
            >
              <span>
                <strong className="block text-[var(--color-text)]">{link.label}</strong>
                <span className="mt-1 block text-sm text-[var(--color-text-sub)]">
                  {link.desc}
                </span>
              </span>
              <span className="text-lg font-extrabold text-[var(--color-primary)]">›</span>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
