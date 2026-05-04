import { getDaysUntil, getExpiryLabel } from "./dateUtils";
import { normalizeIngredient, normalizeRecipe, toArray } from "./normalizers";

const SOON_ITEMS_PREVIEW_LIMIT = 6;

function isSoonIngredient(item) {
  const status = item.freshnessStatus.toUpperCase();
  const days = getDaysUntil(item.expirationDate);

  return (
    status.includes("SOON") ||
    status.includes("WARNING") ||
    (days !== null && days >= 0 && days <= 3)
  );
}

function isExpiredIngredient(item) {
  const status = item.freshnessStatus.toUpperCase();
  const days = getDaysUntil(item.expirationDate);

  return status.includes("EXPIRED") || (days !== null && days < 0);
}

function getSoonItems(summary, normalizedIngredients) {
  const soonItemsFromSummary = toArray(summary?.soonItems).map(normalizeIngredient);

  if (soonItemsFromSummary.length > 0) {
    return soonItemsFromSummary;
  }

  return normalizedIngredients
    .filter(isSoonIngredient)
    .sort((a, b) => (getDaysUntil(a.expirationDate) ?? 999) - (getDaysUntil(b.expirationDate) ?? 999))
}

function buildSummaryCards({ summary, normalizedIngredients, soonCount, expiredCount, recipeCount }) {
  const totalCount = summary?.totalCount ?? normalizedIngredients.length;

  return [
    { key: "total", label: "보유 재료 수", value: totalCount, suffix: "개" },
    { key: "soon", label: "유통기한 임박", value: soonCount, suffix: "개", tone: "warning" },
    { key: "expired", label: "기한 만료", value: expiredCount, suffix: "개", tone: "danger" },
    { key: "recipes", label: "추천 가능 메뉴", value: recipeCount, suffix: "개", tone: "success" },
  ];
}

function buildNotices({ errors, soonCount, expiredCount, recipeCount, normalizedRecipes }) {
  const notices = [
    ...errors.map((name) => ({
      id: `error-${name}`,
      tone: "warning",
      message: `${name} 데이터를 불러오지 못했습니다. 백엔드 실행 상태를 확인해주세요.`,
    })),
    ...(soonCount > 0
      ? [{ id: "soon", tone: "warning", message: `유통기한이 임박한 재료가 ${soonCount}개 있습니다.` }]
      : []),
    ...(expiredCount > 0
      ? [{ id: "expired", tone: "danger", message: `기한이 지난 재료가 ${expiredCount}개 있습니다.` }]
      : []),
    ...(normalizedRecipes.length > 0
      ? [{ id: "recommend", tone: "success", message: `보유 재료 기준 추천 레시피 ${recipeCount}개를 불러왔습니다.` }]
      : []),
  ];

  return notices.length > 0
    ? notices
    : [{ id: "empty", tone: "info", message: "아직 표시할 알림이 없습니다." }];
}

function buildPersonalizationSignals({ normalizedIngredients, soonCount, expiredCount, normalizedRecipes }) {
  return {
    hasFridgeData: normalizedIngredients.length > 0,
    hasUrgentIngredients: soonCount + expiredCount > 0,
    hasRecommendations: normalizedRecipes.length > 0,
  };
}

export function buildDashboardView({ summary, ingredients, recipes, errors }) {
  const normalizedIngredients = toArray(ingredients).map(normalizeIngredient);
  const normalizedRecipes = toArray(recipes).map(normalizeRecipe).slice(0, 3);
  const allSoonItems = getSoonItems(summary, normalizedIngredients);
  const soonItems = allSoonItems.slice(0, SOON_ITEMS_PREVIEW_LIMIT);
  const soonCount = summary?.soonCount ?? allSoonItems.length;
  const expiredCount = summary?.expiredCount ?? normalizedIngredients.filter(isExpiredIngredient).length;
  const recipeCount = toArray(recipes).length;

  return {
    summaryCards: buildSummaryCards({
      summary,
      normalizedIngredients,
      soonCount,
      expiredCount,
      recipeCount,
    }),
    soonItems: soonItems.map((item) => ({
      ...item,
      expiresIn: getExpiryLabel(item.expirationDate),
    })),
    soonTotalCount: soonCount,
    recipes: normalizedRecipes,
    notices: buildNotices({
      errors,
      soonCount,
      expiredCount,
      recipeCount,
      normalizedRecipes,
    }),
    personalizationSignals: buildPersonalizationSignals({
      normalizedIngredients,
      soonCount,
      expiredCount,
      normalizedRecipes,
    }),
  };
}

