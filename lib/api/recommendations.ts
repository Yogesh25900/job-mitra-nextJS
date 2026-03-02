import { getAuthToken } from "../cookie";
import axiosInstance from "./axios";

export const getRecommendedJobs = async (
    candidateId: string,
    topN: number = 10,
    threshold?: number
) => {
    const token = await getAuthToken();
    
    if (!token) {
        return {
            authenticated: false,
            data: []
        };
    }

    const params: any = {
        top_n: topN,
    };

    if (threshold !== undefined) {
        params.threshold = threshold;
    }

    const response = await axiosInstance.get(
        `/api/recommend/${candidateId}`,
        {
            params,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    
    return response.data;
};
