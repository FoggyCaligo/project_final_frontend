import api from "@/config/axios";

// axios 연결
export const shoppingApi = {
  getFridgePrices: () => api.get("/v1/shopping/fridge/prices"),
  getIngredientPrices: (ingredientId) =>
    api.get(`/v1/shopping/ingredients/${ingredientId}/prices`),
};
