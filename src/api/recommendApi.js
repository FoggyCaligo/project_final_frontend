import api from "@/config/axios";

export const getRecommendations = async () => {
    const response =
        await api.get("/recipes/recommendations");

    return response.data;
};
