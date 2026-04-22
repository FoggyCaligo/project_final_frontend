import api from "@/config/axios";

export const testApi = () => {
    return api.get("/test");
};