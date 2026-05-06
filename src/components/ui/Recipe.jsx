import { useEffect, useState } from "react";
import Button from "./Button";
import BookMarkButton from "./BookMarkButton";
import CustomTag from "./Tag";
import { Tooltip } from "antd";
import { addBookmark, removeBookmark, checkBookmarkStatus } from "@/api/bookmarkApi";
import { getMeApi, user } from "@/api/authApi";

const conditionTagMap = {
    DIABETES_LOW_SUGAR: { label: "당뇨 주의", variant: "accent" },
    DIET_LOW_CALORIE: { label: "다이어트 추천", variant: "primary" },
    BABY_STAGE1: { label: "이유식", variant: "secondary" },
    ALLERGY_EGG: { label: "계란 알레르기", variant: "accent" },
};

export default function Recipe({
    recipeId,
    name,
    time,
    quantity,
    difficulty,
    imageURL,
    handleClick,
    llmExplanation,
    semanticScore,
    tagScore,
    hybridScore,
    variant = "list",
    matchRate,
    reason,
    conditionTags = [],
    missingIngredients = [],
    substituteSuggestions = [],
    warnings = [],
    onBookmarkToggle
}) {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const firstSubstitute = substituteSuggestions[0];

    useEffect(() => {
        const fetchBookmarkStatus = async () => {
            try {
                if (!recipeId) {
                    setIsBookmarked(false);
                    return;
                }

                let userId = user?.userId;
                if (!userId) {
                    const me = await getMeApi();
                    userId = me?.userId;
                }

                if (!userId) {
                    setIsBookmarked(false);
                    return;
                }

                const status = await checkBookmarkStatus(recipeId, userId);
                setIsBookmarked(Boolean(status?.isBookmarked));
            } catch (error) {
                console.error("북마크 상태 확인 실패:", error);
                setIsBookmarked(false);
            }
        };

        fetchBookmarkStatus();
    }, [recipeId]);

    const handleBookmarkToggle = async (nextBookmarked) => {
        try {
            if (!recipeId) return false;

            let userId = user?.userId;
            if (!userId) {
                const me = await getMeApi();
                userId = me?.userId;
            }
            if (!userId) return false;

            if (nextBookmarked === false) {
                await removeBookmark(recipeId, userId);
                setIsBookmarked(false);
                onBookmarkToggle?.(false);
                return false;
            }

            await addBookmark(recipeId, userId);
            setIsBookmarked(true);
            onBookmarkToggle?.(true);
            return true;
        } catch (error) {
            console.error("북마크 토글 실패:", error);
            return false;
        }
    };

    return (
        <div className="w-full overflow-hidden rounded-2xl bg-gray-100 border border-gray-100 flex flex-col">

            <div className="h-48 overflow-hidden">
                <img
                    src={imageURL || "/next.svg"}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex flex-col gap-3 p-4">

                {/* title */}
                <div>
                    <div className="text-lg font-bold text-gray-800 line-clamp-2">
                        {name}
                    </div>

                    <div className="mt-1 text-xs text-gray-500">
                        소요 시간: {time} | 난이도: {difficulty}
                    </div>
                </div>


                {variant === "recommend" && (
                    <>
                        {/* 요약 상태 chips */}
                        <div className="flex flex-wrap items-center gap-2">

                            {conditionTags.map(tag => {
                                const mapped = conditionTagMap[tag] || {
                                    label: tag,
                                    variant: "secondary",
                                };

                                return (
                                    <CustomTag
                                        key={tag}
                                        variant={mapped.variant}
                                    >
                                        {mapped.label}
                                    </CustomTag>
                                );
                            })}

                            {warnings.map(warning => (
                                <CustomTag
                                    key={warning.conditionCode}
                                    variant="accent"
                                >
                                    {warning.conditionName} 주의
                                </CustomTag>
                            ))}

                            <CustomTag variant="primary">
                                일치 {matchRate}%
                            </CustomTag>


                            {/* 부족 재료 hover */}
                            <Tooltip
                                placement="top"
                                color="#ffffff"
                                overlayInnerStyle={{
                                    color: "#374151",
                                    borderRadius: "12px",
                                    padding: "10px 12px",
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                                }}
                                title={
                                    missingIngredients.length ? (
                                        <div className="min-w-32">
                                            <div className="mb-2 text-xs font-semibold text-gray-700">
                                                부족 재료
                                            </div>

                                            <div className="flex flex-wrap gap-1">
                                                {missingIngredients.slice(0, 8).map((item, index) => (
                                                    <span
                                                        key={`${item}-${index}`}
                                                        className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                                                    >
                                                        {item}
                                                    </span>
                                                ))}

                                                {missingIngredients.length > 8 && (
                                                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">
                                                        +{missingIngredients.length - 8}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ) : "부족 재료 없음"
                                }
                            >
                                <span className="inline-flex items-center">
                                    <CustomTag
                                        variant={missingIngredients.length ? "accent" : "primary"}
                                    >
                                        부족 {missingIngredients.length}개
                                    </CustomTag>
                                </span>
                            </Tooltip>


                            {substituteSuggestions.length > 0 && (
                                <CustomTag variant="secondary">
                                    대체재 가능
                                </CustomTag>
                            )}

                        </div>


                        {/* 대체재 한 줄 */}
                        {firstSubstitute && (
                            <div className="text-xs text-gray-600 leading-relaxed">
                                대체재{" "}
                                <span className="font-medium text-gray-800">
                                    {firstSubstitute.missingIngredient}
                                </span>
                                {" → "}
                                <span className="font-medium text-gray-800">
                                    {firstSubstitute.substituteIngredient || "없음"}
                                </span>

                                {" "}

                                <span
                                    className={
                                        firstSubstitute.decisionType === "CAUTION"
                                            ? "text-orange-500 font-medium"
                                            : "text-gray-500"
                                    }
                                >
                                    {firstSubstitute.decisionType === "CAUTION"
                                        ? "(맛/간 차이 주의)"
                                        : "(대체 가능)"}
                                </span>
                            </div>
                        )}


                        {/* 추천 이유 */}
                        {reason && (
                            <div className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                                💡 {reason}
                            </div>
                        )}
                        {llmExplanation && (
                            <div className="rounded-xl bg-white/70 p-3 text-sm text-gray-700 leading-relaxed">
                                <div className="mb-1 text-xs font-semibold text-gray-500">
                                    AI 추천 설명
                                </div>
                                {llmExplanation}
                            </div>
                        )}

                    </>
                )}
                <div className="flex flex-row items-center gap-2">                {variant === "recommend" && (
                    <div>
                        {/* semantic {semanticScore ?? "-"} · tag {tagScore ?? "-"} · hybrid {hybridScore ?? "-"} */}
                    </div>
                )}
                    <Button
                        is_full={true}
                        variant="secondary"
                        handleClick={handleClick}
                    >
                        레시피 보기
                    </Button>
                    <BookMarkButton
                        initialBookmarked={isBookmarked}
                        onToggle={handleBookmarkToggle}
                    />
                </div>

            </div>
        </div>
    );
}
