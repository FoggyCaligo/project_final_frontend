import api from "@/config/axios";

export const fridgeApi = {
    getIngredients: () => api.get("/fridge/ingredients"),
    getSummary: () => api.get("/fridge/summary"),
    addIngredient: (data) => api.post("/fridge/ingredients", data),
    updateIngredient: (id, data) => api.patch(`/fridge/ingredients/${id}`, data),
    deleteIngredient: (id) => api.delete(`/fridge/ingredients/${id}`)
};