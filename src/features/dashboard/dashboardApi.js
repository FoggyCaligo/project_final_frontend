import { fridgeApi } from "@/api/fridgeApi";
import { getRecommendations } from "@/api/recommendApi";
import { shoppingApi } from "@/api/shoppingApi";
import { initialDashboardData } from "./constants";

const DASHBOARD_RECOMMENDATION_PAGE_SIZE = 5;

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

const getRecommendationTotalCount = (value) => {
  const totalElements = Number(value?.pageInfo?.totalElements);

  if (Number.isFinite(totalElements)) {
    return totalElements;
  }

  return getRecommendationItems(value).length;
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

export async function requestDashboardBaseData() {
  const [summaryResult, ingredientsResult, shoppingResult] = await Promise.allSettled([
    fridgeApi.getSummary(),
    fridgeApi.getIngredients(),
    shoppingApi.getFridgePrices(),
  ]);

  const errors = [];
  addRejectedSource(errors, summaryResult, "냉장고 요약");
  addRejectedSource(errors, ingredientsResult, "식재료 목록");
  addRejectedSource(errors, shoppingResult, "최저가");

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
    shoppingPrices:
      shoppingResult.status === "fulfilled"
        ? toArray(getDashboardPayload(shoppingResult.value, []))
        : [],
    errors,
  };
}

export async function requestDashboardRecommendations() {
  const result = await Promise.allSettled([
    getRecommendations(0, DASHBOARD_RECOMMENDATION_PAGE_SIZE),
  ]).then((results) => results[0]);

  const errors = [];
  addRejectedSource(errors, result, "추천 레시피");

  return {
    recipes: result.status === "fulfilled" ? getRecommendationItems(result.value) : [],
    recommendationTotalCount:
      result.status === "fulfilled" ? getRecommendationTotalCount(result.value) : 0,
    errors,
  };
}

export async function requestDashboardData() {
  const [baseData, recommendationData] = await Promise.all([
    requestDashboardBaseData(),
    requestDashboardRecommendations(),
  ]);

  return {
    ...baseData,
    ...recommendationData,
    errors: [...baseData.errors, ...recommendationData.errors],
  };
}
