import axiosInstance from "./axios";
import { API } from "./endpoints";

export const getAllJobs = async (page: number = 1, size: number = 10) => {
    const response = await axiosInstance.get(API.JOB.GETALLJOBS, {
        params: {
            page,
            size,
        },
    });
    return response.data;
}

export const getJobById = async (id: string) => {
    const response = await axiosInstance.get(API.JOB.GETJOBBYID(id));
    return response.data;
}

export const searchJobs = async (filters: any) => {
    const response = await axiosInstance.get(API.JOB.SEARCHJOBS, {
        params: filters,
    });
    return response.data;
}
