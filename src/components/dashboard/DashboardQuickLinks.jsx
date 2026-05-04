import Link from "next/link";

export default function DashboardQuickLinks({ links }) {
    return (
        <article className="card-box">
            <div className="card-body">
                <h2 className="card-title">빠른 이동</h2>
                <p className="card-desc">
                    대시보드에서 이어지는 주요 기능 링크입니다.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {links.map((link) => (
                        <Link className="card-box block p-4 transition hover:-translate-y-0.5" href={link.href} key={link.id}>
                            <strong>{link.label}</strong>
                            <p className="card-desc mt-1 text-sm">{link.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </article>
    );
}
