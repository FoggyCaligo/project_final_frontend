
import RecipeDetailInfoTable from "@/components/recipe-detail/RecipeDetailInfoTable";
import RecipeDetailStep from "@/components/recipe-detail/RecipeDetailStep";
import MissingIngredientsPrices from "@/components/recipe-detail/MissingIngredientsPrices";
import styles from "./RecipeDetail.module.css";
import PrivateLayout from "@/components/layout/private/PrivateLayout";
import { getRecipeDetail } from "@/api/recipeApi";
import { notFound } from 'next/navigation';

export default async function RecipeDetailPage({ params }) {
  let recipeData = null;

  try {
    const id = (await params).id || params.id;
    const response = await getRecipeDetail(id);
    recipeData = response.data;
  } catch (error) {
    console.error("레시피를 불러오는데 실패했습니다:", error);
  }

  // 레시피 데이터 없을 시 404 페이지로 이동
  if (!recipeData) notFound();

  const renderStars = (rating) => {
    return (
      <span className={styles.starRating}>
        {"★".repeat(rating)}{"☆".repeat(5 - rating)}
      </span>
    );
  };

  const ingredientData = recipeData.recipeIngredients?.map(ing => ({
    label: ing.rawText.split(' ')[0],
    value: `${ing.amountText || ''}${ing.unit || ''}`.trim() || ing.rawText
  })) || [];

  const nutritionData = [
    { label: "열량", value: `${recipeData.calories ?? 0} kcal` },
    { label: "단백질", value: `${recipeData.protein ?? 0} g` },
    { label: "지방", value: `${recipeData.fat ?? 0} g` },
    { label: "탄수화물", value: `${recipeData.carbs ?? 0} g` },
    { label: "당류", value: `${recipeData.sugar ?? 0} g` },
    { label: "나트륨", value: `${recipeData.sodium ?? 0} mg` },
    { label: "콜레스테롤", value: `${recipeData.cholesterol ?? 0} mg` },
  ];

  const metadata = [
    { label: "조리 시간", value: recipeData.cookTimeText || "정보 없음" },
    { label: "분량", value: recipeData.servingsText || "정보 없음" },
  ];

  const formattedUpdatedAt = recipeData.updatedAt
    ? recipeData.updatedAt.split('T')[0]
    : "정보 없음";

  return (
    <PrivateLayout>
      <div className={styles.recipeContainer}>
        <div className="flex justify-between items-end mb-6">
          <h2 className={styles.recipeSubHeader}>상세 레시피 페이지</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
              <img
                src={recipeData.thumbnailUrl || "https://via.placeholder.com/400"}
                alt={recipeData.title}
                className="w-full h-[400px] object-cover"
              />
            </div>

            <RecipeDetailInfoTable
              title="재료 정보"
              data={ingredientData}
              columns={2}
            />

            <RecipeDetailInfoTable
              title="영양 성분"
              data={nutritionData}
              columns={2}
              emptyMessage="영양 성분 정보가 없습니다."
            />
            <span className={styles.updatedAt}>업데이트 날짜: {formattedUpdatedAt}</span>

            <RecipeDetailInfoTable
              title="요리 정보"
              data={metadata}
              columns={2}
              renderValue={(item) => item.isStars ? renderStars(item.value) : item.value}
            />

            <MissingIngredientsPrices recipeId={recipeData.recipeId} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7">
            <div className="space-y-6">
              {recipeData.recipeSteps?.map((step) => (
                <RecipeDetailStep
                  key={step.stepNo}
                  number={step.stepNo}
                  content={step.instructionText}
                  image={step.stepImageUrl}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
}
