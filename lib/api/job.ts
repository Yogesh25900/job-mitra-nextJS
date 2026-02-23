import { getAuthToken } from "../cookie";
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

export const searchJobs = async (
    filters: any,
    page: number = 1,
    size: number = 10,
    signal?: AbortSignal,
) => {
    const response = await axiosInstance.get(API.JOB.SEARCHJOBS, {
        params: {
            ...filters,
            page,
            size,
        },
        signal,
    });
    return response.data;
}

export const getEmployerJobs = async (page: number = 1, size: number = 5, searchQuery?: string) => {
    try {
                const token = await getAuthToken();
                
                if (!token) {
                    return {
                        authenticated: false,
                        user: null
                    };
                }
                
        const response = await axiosInstance.get(API.JOB.GETMYJOBS, {
            params: {
                page,
                size,
                ...(searchQuery && { searchQuery }),
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('Error fetching employer jobs:', error?.response?.data || error?.message);
        return {
            success: false,
            message: error?.response?.data?.message || 'Failed to fetch jobs',
            data: [],
            total: 0,
            page,
            size,
            totalPages: 0,
        };
    }
}

export const getEmployerJobStats = async () => {
    try {
        const token = await getAuthToken();
        
        if (!token) {
            return {
                success: false,
                message: 'Authentication token not found',
                data: { totalJobs: 0 }
            };
        }

        const response = await axiosInstance.get('/api/jobs/employer/stats', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('Error fetching employer job stats:', error?.response?.data || error?.message);
        return {
            success: false,
            message: error?.response?.data?.message || 'Failed to fetch job stats',
            data: { totalJobs: 0 }
        };
    }
}

export interface JobPayload {
    jobTitle: string;
    companyName: string;
    jobLocation: string;
    jobType: string;
    experienceLevel: string;
    jobCategory: string;
    jobDescription: string;
    applicationDeadline: string;
    responsibilities: string[];
    qualifications: string[];
    tags: string[];
    status?: 'Active' | 'Inactive' | 'Closed';
}

const buildJobFormData = (payload: JobPayload, includeStatus: boolean) => {
    const formData = new FormData();

    formData.append('jobTitle', payload.jobTitle);
    formData.append('companyName', payload.companyName);
    formData.append('jobLocation', payload.jobLocation);
    formData.append('jobType', payload.jobType);
    formData.append('experienceLevel', payload.experienceLevel);
    formData.append('jobCategory', payload.jobCategory);
    formData.append('jobDescription', payload.jobDescription);
    formData.append('applicationDeadline', payload.applicationDeadline);

    // Use array bracket notation for proper parsing
    payload.responsibilities.forEach((item) => {
        formData.append('responsibilities[]', item);
    });

    payload.qualifications.forEach((item) => {
        formData.append('qualifications[]', item);
    });

    payload.tags.forEach((item) => {
        formData.append('tags[]', item);
    });

    if (includeStatus && payload.status) {
        formData.append('status', payload.status);
    }

    return formData;
};

export const createJob = async (payload: JobPayload) => {
    try {
        const token = await getAuthToken();

        if (!token) {
            return {
                success: false,
                message: 'Authentication token not found. Please log in again.'
            };
        }

        const formData = buildJobFormData(payload, false);
        const response = await axiosInstance.post(API.JOB.CREATEJOB, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('Error creating job:', error?.response?.data || error?.message);
        return {
            success: false,
            message: error?.response?.data?.message || 'Failed to create job',
        };
    }
};

export const updateJob = async (jobId: string, payload: JobPayload) => {
    try {
        const token = await getAuthToken();

        if (!token) {
            return {
                success: false,
                message: 'Authentication token not found. Please log in again.'
            };
        }

        const formData = buildJobFormData(payload, true);
        const response = await axiosInstance.put(API.JOB.UPDATEJOB(jobId), formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('Error updating job:', error?.response?.data || error?.message);
        return {
            success: false,
            message: error?.response?.data?.message || 'Failed to update job',
        };
    }
};

export const deleteJob = async (jobId: string) => {
    try {
        const token = await getAuthToken();

        if (!token) {
            return {
                success: false,
                message: 'Authentication token not found. Please log in again.'
            };
        }

        const response = await axiosInstance.delete(API.JOB.DELETEJOB(jobId), {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('Error deleting job:', error?.response?.data || error?.message);
        return {
            success: false,
            message: error?.response?.data?.message || 'Failed to delete job',
        };
    }
};
