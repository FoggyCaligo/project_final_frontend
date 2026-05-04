import api from "@/config/axios";

// Redis 캐시 기반 쇼핑 API v3
export const shoppingApi3 = {
  // 냉장고 식재료 전체 최저가 조회 (로그인 필요)
  getFridgePrices: () => api.get("/v1/shopping/fridge/prices"),

  // 식재료 ID로 최저가 조회
  getIngredientPrices: (ingredientId) =>
    api.get(`/v1/shopping/ingredients/${ingredientId}/prices`),

  // 키워드로 실시간 최저가 검색 (검색기능 : 로그인 불필요)
  searchByKeyword: (keyword) =>
    api.get("/v1/shopping/search", { params: { keyword } }),
};
