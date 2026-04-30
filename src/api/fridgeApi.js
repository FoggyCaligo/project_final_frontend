import api from "@/config/axios";

export const fridgeApi = {
    getIngredients: () => api.get("/v1/fridge/ingredients"),
    getSummary: () => api.get("/v1/fridge/summary"),
    getCategories: () => api.get("/v1/fridge/categories"),
    addIngredient: (data) => api.post("/v1/fridge/ingredients", data),
    updateIngredient: (id, data) => api.patch(`/v1/fridge/ingredients/${id}`, data),
    deleteIngredient: (id) => api.delete(`/v1/fridge/ingredients/${id}`)
};
