"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const menus = [
        { name: "재료 관리", path: "/fridge" },
        { name: "전체레시피", path: "/recipes" },
        { name: "커뮤니티", path: "/community" },
        { name: "추천레시피", path: "/recommendations" },
        { name: "최저가 비교", path: "/ingredients-price" },
    ];

    return (
        <aside className="w-60 border-r p-6">
            <nav className="flex flex-col gap-2">
                {menus.map((menu) => {
                    const active = pathname === menu.path;

                    return (
                        <Link
                            key={menu.path}
                            href={menu.path}
                            className={`rounded-xl px-3 py-2 ${active ? "bg-[#f6f1ea]" : ""
                                }`}
                        >
                            {menu.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}