import api from "@/config/axios";

export const fridgeApi = () => {
    return api.get("/fridge");
};