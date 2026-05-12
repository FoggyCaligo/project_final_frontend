import { getDaysUntil, getExpiryLabel } from "./dateUtils";
import { normalizeIngredient, normalizeRecipe, toArray } from "./normalizers";

const SOON_ITEMS_PREVIEW_LIMIT = 6;
const SHOPPING_ITEMS_PREVIEW_LIMIT = 3;

const storageTypeLabels = {
  REFRIGERATED: "냉장",
  REFRIGERATION: "냉장",
  COLD: "냉장",
  FROZEN: "냉동",
  FREEZER: "냉동",
  ROOM_TEMPERATURE: "실온",
  ROOM: "실온",
  PANTRY: "실온",
};

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
    .sort((a, b) => (getDaysUntil(a.expirationDate) ?? 999) - (getDaysUntil(b.expirationDate) ?? 999));
}

function buildSummaryCards({ summary, normalizedIngredients, soonCount, expiredCount, recipeCount }) {
  const totalCount = summary?.totalCount ?? normalizedIngredients.length;

  return [
    { key: "total", label: "보유 재료", value: totalCount, suffix: "개" },
    { key: "soon", label: "유통기한 임박", value: soonCount, suffix: "개", tone: "warning" },
    { key: "expired", label: "기한 만료", value: expiredCount, suffix: "개", tone: "danger" },
    { key: "recipes", label: "추천 가능 메뉴", value: recipeCount, suffix: "개", tone: "success" },
  ];
}

function normalizeShoppingPrice(item = {}) {
  const lowestPrice = Number(item.lowestPrice ?? item.lowest_price ?? 0);
  const products = toArray(item.items).filter((product) => product && typeof product === "object");
  const lowestProduct =
    products.find((product) => Number(product.price) === lowestPrice) ??
    products[0] ??
    null;

  return {
    id: item.ingredientId ?? item.ingredientMasterId ?? item.id ?? item.ingredientName,
    ingredientName: item.ingredientName ?? item.name ?? "이름 없는 재료",
    lowestPrice: Number.isFinite(lowestPrice) ? lowestPrice : 0,
    productName: lowestProduct?.productName ?? lowestProduct?.name ?? "",
    mallName: lowestProduct?.mallName ?? "",
    purchaseUrl: lowestProduct?.purchaseUrl ?? "",
    productCount: products.length,
  };
}

function buildShoppingSummary(shoppingPrices) {
  const items = toArray(shoppingPrices)
    .map(normalizeShoppingPrice)
    .filter((item) => item.lowestPrice > 0)
    .sort((a, b) => a.lowestPrice - b.lowestPrice);

  const lowestItem = items[0] ?? null;
  const totalLowestPrice = items.reduce((sum, item) => sum + item.lowestPrice, 0);

  return {
    totalCount: items.length,
    totalLowestPrice,
    lowestItem,
    items: items.slice(0, SHOPPING_ITEMS_PREVIEW_LIMIT),
  };
}

function getBarPercent(value, maxValue) {
  if (!value || !maxValue) {
    return 0;
  }

  return Math.max(6, Math.round((value / maxValue) * 100));
}

function buildStorageBreakdown(normalizedIngredients) {
  const counts = normalizedIngredients.reduce((acc, item) => {
    const key = String(item.storageType || "").toUpperCase();
    const label = storageTypeLabels[key] ?? "기타";
    acc[label] = (acc[label] ?? 0) + 1;
    return acc;
  }, {});

  const entries = ["냉장", "냉동", "실온", "기타"].map((label) => ({
    label,
    value: counts[label] ?? 0,
  }));
  const maxValue = Math.max(...entries.map((entry) => entry.value), 1);

  return entries.map((entry) => ({
    ...entry,
    percent: getBarPercent(entry.value, maxValue),
  }));
}

function buildPersonalizedTips({ soonCount, expiredCount, recipeCount, shoppingSummary }) {
  if (expiredCount > 0) {
    return {
      tone: "danger",
      title: "기한 지난 재료 정리가 먼저예요",
      description: `만료 재료 ${expiredCount}개를 먼저 확인한 뒤 추천 메뉴를 고르는 흐름이 좋아요.`,
    };
  }

  if (soonCount > 0) {
    return {
      tone: "warning",
      title: "임박 재료를 먼저 활용해보세요",
      description: `유통기한 임박 재료 ${soonCount}개를 기준으로 오늘 메뉴를 좁힐 수 있어요.`,
    };
  }

  if (recipeCount > 0) {
    return {
      tone: "success",
      title: "오늘 바로 고를 수 있는 메뉴가 있어요",
      description: `보유 재료 기준 추천 메뉴 ${recipeCount}개를 불러왔어요.`,
    };
  }

  if (shoppingSummary.totalCount > 0) {
    return {
      tone: "success",
      title: "재료 가격 비교가 준비됐어요",
      description: `냉장고 식재료 ${shoppingSummary.totalCount}개의 최저가를 확인할 수 있어요.`,
    };
  }

  return {
    tone: "info",
    title: "냉장고 데이터를 채우면 더 정확해져요",
    description: "재료를 등록하면 임박 재료, 추천 메뉴, 최저가 정보를 한 화면에서 볼 수 있어요.",
  };
}

function buildInsights({ normalizedIngredients, soonCount, expiredCount, recipeCount, shoppingSummary }) {
  const totalCount = normalizedIngredients.length;
  const maxValue = Math.max(totalCount, soonCount, expiredCount, recipeCount, shoppingSummary.totalCount, 1);
  const overviewBars = [
    { key: "total", label: "보유 재료", value: totalCount, tone: "neutral" },
    { key: "soon", label: "임박 재료", value: soonCount, tone: "warning" },
    { key: "expired", label: "만료 재료", value: expiredCount, tone: "danger" },
    { key: "recipes", label: "추천 메뉴", value: recipeCount, tone: "success" },
  ].map((item) => ({
    ...item,
    percent: getBarPercent(item.value, maxValue),
  }));

  return {
    overviewBars,
    storageBreakdown: buildStorageBreakdown(normalizedIngredients),
    tip: buildPersonalizedTips({ soonCount, expiredCount, recipeCount, shoppingSummary }),
  };
}

function buildNotices({
  errors,
  soonCount,
  expiredCount,
  recipeCount,
  normalizedRecipes,
  shoppingSummary,
}) {
  const notices = [
    ...(expiredCount > 0
      ? [{
          id: "expired",
          tone: "danger",
          label: "기한 만료",
          title: `만료 재료 ${expiredCount}개 확인이 필요합니다`,
          message: "기한이 지난 재료는 냉장고에서 먼저 확인한 뒤 삭제하거나 사용 여부를 정리해주세요.",
          href: "/fridge",
          actionLabel: "냉장고 보기",
        }]
      : []),
    ...(soonCount > 0
      ? [{
          id: "soon",
          tone: "warning",
          label: "임박",
          title: `유통기한 임박 재료 ${soonCount}개가 있습니다`,
          message: "가까운 날짜의 재료부터 먼저 사용하면 버리는 재료를 줄일 수 있어요.",
          href: "/fridge",
          actionLabel: "냉장고 보기",
        }]
      : []),
    ...errors.map((name) => ({
      id: `error-${name}`,
      tone: "warning",
      label: "연결 확인",
      title: `${name} 데이터를 불러오지 못했습니다`,
      message: "백엔드 실행 상태나 로그인 상태를 확인한 뒤 대시보드를 새로고침해주세요.",
    })),
    ...(normalizedRecipes.length > 0
      ? [{
          id: "recommend",
          tone: "success",
          label: "추천",
          title: `추천 후보 레시피 ${recipeCount}개를 확인했습니다`,
          message: "일치율이 높은 메뉴부터 확인하고 부족한 재료는 가격비교로 이어서 볼 수 있어요.",
          href: "/recommendations",
          actionLabel: "추천 보기",
        }]
      : []),
    ...(shoppingSummary.totalCount > 0
      ? [{
          id: "shopping",
          tone: "success",
          label: "가격 비교",
          title: `가격 비교 데이터 ${shoppingSummary.totalCount}개가 준비됐습니다`,
          message: "부족한 재료나 다시 구매할 재료가 있으면 최저가를 확인해보세요.",
          href: "/ingredients-price",
          actionLabel: "가격 비교 보기",
        }]
      : []),
  ];

  return notices.length > 0
    ? notices
    : [{
        id: "empty",
        tone: "info",
        label: "안내",
        title: "새 알림이 없습니다",
        message: "냉장고 재료를 추가하면 임박 재료, 추천 레시피, 가격 비교 알림을 이곳에서 확인할 수 있어요.",
      }];
}

function buildPersonalizationSignals({ normalizedIngredients, soonCount, expiredCount, normalizedRecipes, shoppingSummary }) {
  return {
    hasFridgeData: normalizedIngredients.length > 0,
    hasUrgentIngredients: soonCount + expiredCount > 0,
    hasRecommendations: normalizedRecipes.length > 0,
    hasShoppingPrices: shoppingSummary.totalCount > 0,
  };
}

function getRecipeMatchRate(recipe) {
  const matchRate = Number(recipe.matchRate);
  return Number.isFinite(matchRate) ? matchRate : -1;
}

export function buildDashboardView({ summary, ingredients, recipes, recommendationTotalCount, shoppingPrices = [], errors }) {
  const normalizedIngredients = toArray(ingredients).map(normalizeIngredient);
  const normalizedRecipes = toArray(recipes)
    .map(normalizeRecipe)
    .sort((a, b) => getRecipeMatchRate(b) - getRecipeMatchRate(a))
    .slice(0, 3);
  const shoppingSummary = buildShoppingSummary(shoppingPrices);
  const allSoonItems = getSoonItems(summary, normalizedIngredients);
  const soonItems = allSoonItems.slice(0, SOON_ITEMS_PREVIEW_LIMIT);
  const soonCount = summary?.soonCount ?? allSoonItems.length;
  const expiredCount = summary?.expiredCount ?? normalizedIngredients.filter(isExpiredIngredient).length;
  const ingredientTotalCount = summary?.totalCount ?? normalizedIngredients.length;
  const hasIngredients = ingredientTotalCount > 0;
  const recommendationCount = Number(recommendationTotalCount);
  const recipeCount = hasIngredients && Number.isFinite(recommendationCount) && recommendationCount > 0
    ? recommendationCount
    : toArray(recipes).length;
  const displayRecipes = hasIngredients ? normalizedRecipes : [];
  const insights = buildInsights({
    normalizedIngredients,
    soonCount,
    expiredCount,
    recipeCount: hasIngredients ? recipeCount : 0,
    shoppingSummary,
  });

  return {
    summaryCards: buildSummaryCards({
      summary,
      normalizedIngredients,
      soonCount,
      expiredCount,
      recipeCount: hasIngredients ? recipeCount : 0,
    }),
    soonItems: soonItems.map((item) => ({
      ...item,
      expiresIn: getExpiryLabel(item.expirationDate),
    })),
    soonTotalCount: soonCount,
    recipes: displayRecipes,
    shoppingSummary,
    insights,
    notices: buildNotices({
      errors: toArray(errors),
      soonCount,
      expiredCount,
      recipeCount: hasIngredients ? recipeCount : 0,
      normalizedRecipes: displayRecipes,
      shoppingSummary,
    }),
    personalizationSignals: buildPersonalizationSignals({
      normalizedIngredients,
      soonCount,
      expiredCount,
      normalizedRecipes: displayRecipes,
      shoppingSummary,
    }),
  };
}
