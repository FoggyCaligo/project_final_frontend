import api from "@/config/axios";

export const getChatRecommendations = async (text, ownedIngredients = []) => {
    const res = await api.post("/v1/chat/recommend", {
        text,
        ownedIngredients,
    });

    return res.data.data;
};
