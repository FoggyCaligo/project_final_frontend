'use client';

import { useAuth } from "@/context/AuthContext";
import LogoutButton from "./LogoutButton";

export default function UserMenu() {
    const { user } = useAuth();

    return (
        <div className="flex items-center gap-3">
            {user ? (
                <LogoutButton />
            ) : (
                <span className="text-sm text-gray-400">로그인 확인 중...</span>
            )}
            <div className="h-8 w-8 rounded-full bg-[#ddd]" />
        </div>
    );
}