"use client";

import { useState } from "react";
import PrivateLayout from "@/components/layout/private/PrivateLayout";
import Section from "@/components/ui/Section";
import Recipe from "@/components/ui/Recipe";
import Button from "@/components/ui/Button";
import { getChatRecommendations } from "@/api/chatApi";

export default function ChatPage() {

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState([]);

    const handleSend = async () => {
        if (!message.trim()) return;

        try {
            setLoading(true);

            const data = await getChatRecommendations(
                message,
                ["양배추", "두부"] // 임시 mock 냉장고 재료
            );

            setRecommendations(data);

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PrivateLayout>
            <Section>

                <h1 className="text-2xl font-bold mb-6">
                    챗봇 추천
                </h1>

                <div className="flex gap-2 mb-8">
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="예) 당뇨인데 두부로 저녁 추천해줘"
                        className="flex-1 rounded-xl border p-3"
                    />

                    <Button
                        variant="secondary"
                        handleClick={handleSend}
                    >
                        전송
                    </Button>
                </div>

                {loading && (
                    <div>
                        추천 생성중...
                    </div>
                )}

                {!!recommendations.length && (
                    <div className="grid gap-4 md:grid-cols-3">
                        {recommendations.map(recipe => (
                            <Recipe
                                key={recipe.recipeId}
                                name={recipe.title}
                                time={recipe.cookTimeText || "정보 없음"}
                                difficulty={recipe.summary || "보통"}
                                imageURL={recipe.thumbnailUrl}
                                variant="recommend"
                                matchRate={recipe.matchRate}
                                reason={recipe.reason}
                                conditionTags={recipe.conditionTags}
                                missingIngredients={recipe.missingIngredients}
                                substituteSuggestions={recipe.substituteSuggestions}
                                warnings={recipe.warnings}
                                llmExplanation={recipe.llmExplanation}
                                semanticScore={recipe.semanticScore}
                                tagScore={recipe.tagScore}
                                hybridScore={recipe.hybridScore}
                            />
                        ))}
                    </div>
                )}

            </Section>
        </PrivateLayout>
    );
}