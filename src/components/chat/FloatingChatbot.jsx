"use client";

import { useState } from "react";
import Recipe from "@/components/ui/Recipe";
import Button from "@/components/ui/Button";
import { getChatRecommendations } from "@/api/chatApi";

export default function FloatingChatbot() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState([]);

    const handleSend = async () => {
        if (!message.trim()) return;

        try {
            setLoading(true);

            const data = await getChatRecommendations(
                message,
                ["양배추", "두부"] // TODO: 회원 냉장고 재료로 교체
            );

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
                        <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
                            예) 당뇨인데 두부로 간단한 저녁 추천해줘
                        </div>

                        <div className="flex gap-2">
                            <input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSend();
                                }}
                                placeholder="오늘 뭐 먹을까요?"
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

                        <div className="max-h-[380px] overflow-y-auto flex flex-col gap-3 pr-1">
                            {recommendations.map((recipe) => (
                                <Recipe
                                    key={recipe.recipeId}
                                    name={recipe.title}
                                    time={recipe.cookTime || "정보 없음"}
                                    difficulty={recipe.difficulty || "보통"}
                                    imageURL={recipe.thumbnailUrl}
                                    variant="recommend"
                                    matchRate={recipe.matchRate}
                                    reason={recipe.reason}
                                    conditionTags={recipe.conditionTags || []}
                                    missingIngredients={recipe.missingIngredients || []}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}