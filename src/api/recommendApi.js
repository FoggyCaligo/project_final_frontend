import api from "@/config/axios";

export const getRecommendations = async () => {
    const response =
        await api.get("/v1/recipes/recommendations");

    return response.data.data;
};
