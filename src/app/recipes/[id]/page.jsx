"use client";

import { useEffect, useState } from "react";
import RecipeInfoTable from "@/components/recipe/RecipeInfoTable";
import RecipeIngredients from "@/components/recipe/RecipeIngredients";
import RecipeStep from "@/components/recipe/RecipeStep";
import CookRecipeButton from "@/components/recipe/CookRecipeButton";
import BookmarkButton from "@/components/recipe/BookmarkButton";
import styles from "./Recipe.module.css";
import PrivateLayout from "@/components/layout/private/PrivateLayout";
import { getRecipeDetail } from "@/api/recipeApi";
import { notFound, useParams } from 'next/navigation';

export default function RecipePage() {
  const params = useParams();
  const id = params?.id;
  const [recipeData, setRecipeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      try {
        const result = await getRecipeDetail(id);
        setRecipeData(result);
      } catch (error) {
        console.error("레시피를 불러오는데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  // 레시피 데이터 없을 시 404 페이지로 이동
  if (!loading && !recipeData) notFound();

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

  if (loading) {
    return (
      <PrivateLayout>
        <div className="flex justify-center items-center h-screen">로딩 중...</div>
      </PrivateLayout>
    );
  }

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

  return (
    <PrivateLayout>
      <div className={styles.recipeContainer}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={styles.recipeSubHeader}>{recipeData.title}</h2>
          <div className="flex gap-3">
            <BookmarkButton recipeId={recipeData.recipeId} />
            <CookRecipeButton recipeId={recipeData.recipeId} recipeIngredients={recipeData.recipeIngredients} />
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

            <RecipeIngredients recipeIngredients={recipeData.recipeIngredients} />

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
