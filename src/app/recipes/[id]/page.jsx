import RecipeIngredients from "@/components/recipe/RecipeIngredients";
import RecipeInfoTable from "@/components/recipe/RecipeInfoTable";
import RecipeStep from "@/components/recipe/RecipeStep";
import CookRecipeButton from "@/components/recipe/CookRecipeButton";
import BookmarkButton from "@/components/recipe/BookmarkButton";
import styles from "./Recipe.module.css";
import PrivateLayout from "@/components/layout/private/PrivateLayout";
import { getRecipeDetail } from "@/api/recipeApi";
import { notFound, redirect } from 'next/navigation';

export default async function RecipePage({ params, searchParams }) {
  // Next.js 15+ 에서 params와 searchParams는 Promise이므로 await가 필요합니다.
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const id = resolvedParams?.id;

  console.log(`[RecipePage] Entering component for ID: ${id}`);
  
  let recipeData = null;

  try {
    console.log(`[RecipePage] Fetching recipe detail for ID: ${id}`);
    
    const response = await getRecipeDetail(id);
    console.log(`[RecipePage] Successfully fetched recipe data:`, {
      id: response?.recipeId,
      title: response?.title,
      stepCount: response?.recipeSteps?.length
    });
    
    recipeData = response; 
  } catch (error) {
    console.error("[RecipePage] Failed to fetch recipe:", error);
    if (error.name === 'ApiError') {
      console.error("[RecipePage] ApiError details:", {
        status: error.status,
        url: error.url,
        message: error.message,
        code: error.code
      });
    }
  }

  if (!recipeData) {
    console.log("[RecipePage] No recipe data found, triggering notFound()");
    notFound();
  }

  // 난이도 별점 렌더링
  const renderStars = (rating) => {
    if (rating == "초급") rating = 2;
    else if (rating == "중급") rating = 3;
    else if (rating == "고급") rating = 4;
    else if (rating == "아무나") rating = 1;
    else return (<span>정보 없음</span>);
    return (
      <span className={styles.starRating}>
        {"★".repeat(rating)}{"☆".repeat(5 - rating)}
      </span>
    );
  };

  // 영양 성분 데이터 가공
  const nutritionData = [
    { label: "열량", value: `${recipeData.calories ?? 0} kcal` },
    { label: "단백질", value: `${recipeData.protein ?? 0} g` },
    { label: "지방", value: `${recipeData.fat ?? 0} g` },
    { label: "탄수화물", value: `${recipeData.carbs ?? 0} g` },
    { label: "당류", value: `${recipeData.sugar ?? 0} g` },
    { label: "나트륨", value: `${recipeData.sodium ?? 0} mg` },
    { label: "콜레스테롤", value: `${recipeData.cholesterol ?? 0} mg` },
  ];

  // 요리 정보 데이터 가공
  const metadata = [
    { label: "조리 시간", value: recipeData.cookTimeText || "정보 없음" },
    { label: "분량", value: recipeData.servingsText || "정보 없음" },
    { label: "난이도", value: renderStars(recipeData.difficultyLevel) || "정보 없음" },
  ];

  // 업데이트 날짜 가공
  const formattedUpdatedAt = recipeData.updatedAt
    ? recipeData.updatedAt.split('T')[0]
    : "정보 없음";

  // 디버깅 전용
  //return (<pre>{JSON.stringify(recipeData, null, 2)}</pre>);

  return (
    <PrivateLayout>
      <div className={styles.recipeContainer}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={styles.recipeSubHeader}>{recipeData.title}</h2>
          <div className="flex gap-3">
            <BookmarkButton recipeId={recipeData.recipeId} />
            <CookRecipeButton recipeId={recipeData.recipeId} />
          </div>
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

            <RecipeInfoTable
              title="재료 정보"
              data={ingredientData}
              columns={2}
            />

            <RecipeInfoTable
              title="영양 성분"
              data={nutritionData}
              columns={2}
              emptyMessage="영양 성분 정보가 없습니다."
            />
            <span className={styles.updatedAt}>업데이트 날짜: {formattedUpdatedAt}</span>

            <RecipeInfoTable
              title="요리 정보"
              data={metadata}
              columns={2}
              renderValue={(item) => item.isStars ? renderStars(item.value) : item.value}
            />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7">
            <div className="space-y-6">
              {recipeData.recipeSteps?.map((step) => (
                <RecipeStep
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