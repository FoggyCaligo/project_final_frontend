import api from "@/config/axios";

export async function requestHealthPreferenceSave(payload) {
    const response = await api.put("/v1/users/me/conditions", payload);
    return response.data.data;
}