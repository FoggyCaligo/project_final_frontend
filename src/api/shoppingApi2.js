import api from "@/config/axios";

// 11번가 + 네이버쇼핑 연동 v2 엔드포인트
export const shoppingApi = {
  getFridgePrices: () => api.get("/v2/shopping/fridge/prices"),
  getIngredientPrices: (ingredientId) =>
    api.get(`/v2/shopping/ingredients/${ingredientId}/prices`),
};
