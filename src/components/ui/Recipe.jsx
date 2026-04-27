import Button from "./Button"

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
                        <div className="mt-2 text-sm font-medium">
                            재료 일치율 {matchRate}%
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {conditionTags.map(tag => (
                                <span
                                    key={tag}
                                    className="px-2 py-1 rounded-full text-xs bg-white"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="text-sm text-gray-600">
                            부족 재료:
                            {missingIngredients.length
                                ? missingIngredients.join(", ")
                                : " 없음"}
                        </div>

                        <p className="text-sm text-gray-600">
                            {reason}
                        </p>
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