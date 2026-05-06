import api from "@/config/axios";

export const getRecommendations = async (page = 0, size = 9) => {
    const response = await api.get("/v1/recipes/recommendations", {
        params: { page, size },
    });

    return response.data.data;
};
