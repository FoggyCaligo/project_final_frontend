import api from "@/config/axios";

export const fridgeApi = {
    getIngredients: () => api.get("/v1/fridge/ingredients"),
    getSummary: () => api.get("/v1/fridge/summary"),
    getCategories: () => api.get("/v1/fridge/categories"),
    addIngredient: (data) => api.post("/v1/fridge/ingredients", data),
    updateIngredient: (id, data) => api.patch(`/v1/fridge/ingredients/${id}`, data),
    deleteIngredient: (id) => api.delete(`/v1/fridge/ingredients/${id}`),
    /** Spring → FastAPI 비전 파이프라인 (multipart `file`, query `topK`) */
    recognizeIngredientImage: (file, topK = 3) => {
        const fd = new FormData();
        fd.append("file", file);
        return api.post("/v1/fridge/ingredients/recognize-image", fd, {
            params: { topK },
            transformRequest: [
                (data, headers) => {
                    if (headers && typeof headers.delete === "function") {
                        headers.delete("Content-Type");
                    } else if (headers && typeof headers === "object") {
                        delete headers["Content-Type"];
                        delete headers["content-type"];
                    }
                    return data;
                },
            ],
        });
    },
};
