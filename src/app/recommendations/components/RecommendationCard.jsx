import Card from "@/components/ui/Card";

export default function RecommendationCard({ recipe }) {
    return (
        <Card>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold">{recipe.title}</h2>
                    <p className="mt-2 text-sm text-gray-600">{recipe.reason}</p>
                </div>

                <div className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium">
                    {recipe.matchRate}% 일치
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {recipe.conditionTags?.map((tag) => (
                    <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="mt-4 text-sm text-gray-700">
                부족 재료:{" "}
                {recipe.missingIngredients?.length
                    ? recipe.missingIngredients.join(", ")
                    : "없음"}
            </div>
        </Card>
    );
}