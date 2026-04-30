import api from "@/config/axios";

const toRecommendationList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.content)) return payload.content;
    if (Array.isArray(payload?.items)) return payload.items;
    return [];
};

export const getRecommendations = async () => {
    const response = await api.get("/recipes/recommendations");
    return toRecommendationList(response.data?.data ?? response.data);
};
