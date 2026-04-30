import api from "@/config/axios";

export const testApi = () => {
    return api.get("/v1/test");
};
