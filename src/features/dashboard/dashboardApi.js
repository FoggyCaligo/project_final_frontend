import { fridgeApi } from "@/api/fridgeApi";
import { getRecommendations } from "@/api/recommendApi";
import { initialDashboardData } from "./constants";

const getDashboardPayload = (response, fallback) => response?.data?.data ?? fallback;

const toArray = (value) => (Array.isArray(value) ? value : []);
const getRecommendationItems = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.content)) {
    return value.content;
  }

  return [];
};

function getIngredientItems(response) {
  const payload = getDashboardPayload(response, { items: [] });

  if (Array.isArray(payload)) {
    return payload;
  }

  return toArray(payload?.items);
}

function addRejectedSource(errors, result, label) {
  if (result.status === "rejected") {
    errors.push(label);
  }
}

export async function requestDashboardData() {
  const [summaryResult, ingredientsResult, recommendationsResult] = await Promise.allSettled([
    fridgeApi.getSummary(),
    fridgeApi.getIngredients(),
    getRecommendations(),
  ]);

  const errors = [];
  addRejectedSource(errors, summaryResult, "냉장고 요약");
  addRejectedSource(errors, ingredientsResult, "식재료 목록");
  addRejectedSource(errors, recommendationsResult, "추천 레시피");

  return {
    ...initialDashboardData,
    summary:
      summaryResult.status === "fulfilled"
        ? getDashboardPayload(summaryResult.value, null)
        : null,
    ingredients:
      ingredientsResult.status === "fulfilled"
        ? getIngredientItems(ingredientsResult.value)
        : [],
    recipes:
      recommendationsResult.status === "fulfilled"
        ? getRecommendationItems(recommendationsResult.value)
        : [],
    errors,
  };
}
