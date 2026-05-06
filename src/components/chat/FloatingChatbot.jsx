"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Recipe from "@/components/ui/Recipe";
import Button from "@/components/ui/Button";
import { getChatRecommendations } from "@/api/chatApi";

export default function FloatingChatbot() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [botMessage, setBotMessage] = useState("");
    const router = useRouter();

    const handleSend = async () => {
        if (!message.trim()) return;

        try {
            setLoading(true);

            const data = await getChatRecommendations(
                message,
                ["양배추", "두부"] // TODO: 회원 냉장고 재료로 교체
            );
            const explanationMessage = data
                .map((recipe, index) => {
                    const explanation =
                        recipe.llmExplanation ||
                        recipe.reason ||
                        "요청하신 조건과 잘 맞는 레시피입니다.";

                    return `${index + 1}. ${recipe.title}\n${explanation}`;
                })
                .join("\n\n");

            setBotMessage(explanationMessage);
            setRecommendations(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 z-50 rounded-full bg-white border shadow-lg px-5 py-4 text-sm font-semibold"
            >
                💬 오늘 뭐 해먹지?
            </button>

            {open && (
                <div className="fixed bottom-24 right-6 z-50 w-[420px] max-h-[620px] rounded-2xl bg-white shadow-2xl border overflow-hidden">
                    <div className="flex items-center justify-between border-b px-5 py-4">
                        <div>
                            <div className="font-bold text-gray-800">
                                오늘냉장고 챗봇
                            </div>
                            <div className="text-xs text-gray-500">
                                조건과 보유 재료를 기준으로 추천해드려요
                            </div>
                        </div>

                        <button
                            onClick={() => setOpen(false)}
                            className="text-gray-400 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="p-4 flex flex-col gap-4">
                        <div className="flex gap-2">
                            <input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSend();
                                }}
                                placeholder="예) 당뇨인데 두부로 간단한 저녁 추천해줘"
                                className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
                            />

                            <Button
                                variant="secondary"
                                handleClick={handleSend}
                            >
                                전송
                            </Button>
                        </div>

                        {loading && (
                            <div className="text-sm text-gray-500">
                                추천 생성 중...
                            </div>
                        )}

                        <div className="max-h-[390px] overflow-y-auto flex flex-col gap-4 pr-1">

                            {botMessage && (
                                <div className="max-w-[90%] whitespace-pre-line rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-700 leading-relaxed">
                                    {botMessage}
                                </div>
                            )}

                            {!!recommendations.length && (
                                <div>
                                    <div className="mb-2 text-xs font-semibold text-gray-500">
                                        추천 레시피
                                    </div>

                                    <div className="flex gap-3 overflow-x-auto pb-2">
                                        {recommendations.map((recipe) => (
                                            <button
                                                key={recipe.recipeId}
                                                onClick={() => router.push(`/recipes/${recipe.recipeId}`)}
                                                className="min-w-[220px] max-w-[220px] overflow-hidden rounded-2xl border bg-white text-left shadow-sm"
                                            >
                                                <div className="h-32 overflow-hidden bg-gray-100">
                                                    <img
                                                        src={recipe.thumbnailUrl || "/next.svg"}
                                                        alt={recipe.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>

                                                <div className="p-3">
                                                    <div className="line-clamp-2 text-sm font-bold text-gray-800">
                                                        {recipe.title}
                                                    </div>

                                                    <div className="mt-1 text-xs text-gray-500">
                                                        {recipe.cookTimeText || "정보 없음"} · 일치 {recipe.matchRate}%
                                                    </div>

                                                    {recipe.reason && (
                                                        <div className="mt-2 line-clamp-2 text-xs text-gray-600">
                                                            {recipe.reason}
                                                        </div>
                                                    )}             </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
