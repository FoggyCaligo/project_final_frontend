import Button from "./Button"
import CustomTag from "./Tag";

const conditionTagMap = {
    DIABETES_LOW_SUGAR: { label: "당뇨 주의", variant: "accent" },
    DIET_LOW_CALORIE: { label: "다이어트 추천", variant: "primary" },
    BABY_STAGE1: { label: "이유식", variant: "secondary" },
    ALLERGY_EGG: { label: "계란 알레르기", variant: "accent" },
}

export default function Recipe({
    name,
    time,
    difficulty,
    imageURL,
    handleClick,

    variant = "list",
    matchRate,
    reason,
    conditionTags = [],
    missingIngredients = []
}) {

    return (
        <div className="w-full overflow-hidden rounded-2xl bg-gray-100 flex flex-col border border-gray-100">
            <div className="h-48 overflow-hidden">
                <img
                    src={imageURL || "/next.svg"}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex flex-col gap-2 p-4">
                <div className="text-lg font-bold text-gray-800">
                    {name}
                </div>

                <div className="text-xs text-gray-500">
                    소요 시간: {time} | 난이도: {difficulty}
                </div>

                {variant === "recommend" && (
                    <>
                        <div className="mt-2 text-sm font-medium text-gray-700">
                            재료 일치율 {matchRate}%
                        </div>

                        {conditionTags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {conditionTags.map(tag => {
                                    const mapped = conditionTagMap[tag] || {
                                        label: tag,
                                        variant: "secondary",
                                    }

                                    return (
                                        <CustomTag key={tag} variant={mapped.variant}>
                                            {mapped.label}
                                        </CustomTag>
                                    )
                                })}
                            </div>
                        )}

                        <div className="rounded-xl bg-white p-3 border text-sm">
                            <div className="mb-2 font-medium text-gray-700">
                                부족 재료
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {missingIngredients.length ? (
                                    missingIngredients.map((ingredient) => (
                                        <CustomTag key={ingredient} variant="accent">
                                            {ingredient}
                                        </CustomTag>
                                    ))
                                ) : (
                                    <CustomTag variant="primary">
                                        없음
                                    </CustomTag>
                                )}
                            </div>
                        </div>

                        {reason && (
                            <div className="rounded-xl bg-white p-3 text-sm text-gray-600 border">
                                💡 {reason}
                            </div>
                        )}
                    </>
                )}

                <Button
                    is_full={true}
                    variant="secondary"
                    handleClick={handleClick}
                >
                    레시피 보기
                </Button>
            </div>
        </div>
    )
}