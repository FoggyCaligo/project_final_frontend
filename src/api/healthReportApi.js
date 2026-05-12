import api from "@/config/axios";
import { unwrapApiData } from "@/api/utils";

export const healthReportApi = {
    /**
     * Generate a new AI health report
     */
    generateHealthReport: async () => {
        const response = await api.post("/v1/meal/health-report/generate");
        return unwrapApiData(response);
    },

    /**
     * Fetch the latest AI health report
     */
    getLatestHealthReport: async () => {
        const response = await api.get("/v1/meal/health-report/latest");
        return unwrapApiData(response);
    }
};
