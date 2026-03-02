import axiosInstance from "../axios";
import { API } from "../endpoints";

export const getAllJobsAsAdmin = async (
    token: string,
    page: number = 1,
    size: number = 10,
    search: string = '',
    status: string = 'All'
) => {
    try {
        console.log('[API] getAllJobsAsAdmin called with:', { page, size, search, status });
        const response = await axiosInstance.get(API.ADMIN.JOB.GETALLJOBS, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            params: {
                page,
                size,
                search: search.trim() !== '' ? search : undefined,
                status: status !== 'All' ? status : undefined,
            },
        });
        console.log('[API] getAllJobsAsAdmin response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('[API] getAllJobsAsAdmin error:', error.message || error);
        if (error.response?.data) {
            return error.response.data;
        }
        return {
            success: false,
            message: error.message || 'Failed to fetch jobs'
        };
    }
}

export const getJobStatsAsAdmin = async (token: string) => {
    try {
        console.log('[API] getJobStatsAsAdmin called');
        const response = await axiosInstance.get(API.ADMIN.JOB.STATS, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log('[API] getJobStatsAsAdmin response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('[API] getJobStatsAsAdmin error:', error.message || error);
        if (error.response?.data) {
            return error.response.data;
        }
        return {
            success: false,
            message: error.message || 'Failed to fetch stats'
        };
    }
}

export const getJobByIdAsAdmin = async (id: string, token: string) => {
    const response = await axiosInstance.get(API.ADMIN.JOB.GETJOBBYID(id), {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.data;
}

export const createJobAsAdmin = async (jobData: any, token: string) => {
    // If there's a form data with files, send as FormData
    if (jobData.companyProfilePicBase64) {
        const formData = new FormData();
        
        // Add all fields except the base64
        const { companyProfilePicBase64, companyProfilePicName, ...restData } = jobData;
        Object.entries(restData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    formData.append(`${key}[${index}]`, item);
                });
            } else {
                formData.append(key, value as string);
            }
        });
        
        // Convert base64 to Blob
        const response = await fetch(jobData.companyProfilePicBase64);
        const blob = await response.blob();
        const file = new File([blob], companyProfilePicName || 'companyProfile', { type: blob.type });
        formData.append('companyProfilePic', file);

        const axiosResponse = await axiosInstance.post(API.ADMIN.JOB.CREATE, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return axiosResponse.data;
    }

    // Otherwise send as JSON
    const axiosResponse = await axiosInstance.post(API.ADMIN.JOB.CREATE, jobData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return axiosResponse.data;
}

export const updateJobByIdAsAdmin = async (id: string, jobData: any, token: string) => {
    // If there's a form data with files, send as FormData
    if (jobData.companyProfilePicBase64) {
        const formData = new FormData();
        
        // Add all fields except the base64
        const { companyProfilePicBase64, companyProfilePicName, ...restData } = jobData;
        Object.entries(restData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    formData.append(`${key}[${index}]`, item);
                });
            } else {
                formData.append(key, value as string);
            }
        });
        
        // Convert base64 to Blob
        const response = await fetch(jobData.companyProfilePicBase64);
        const blob = await response.blob();
        const file = new File([blob], companyProfilePicName || 'companyProfile', { type: blob.type });
        formData.append('companyProfilePic', file);

        const axiosResponse = await axiosInstance.put(API.ADMIN.JOB.UPDATE(id), formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return axiosResponse.data;
    }

    // Otherwise send as JSON
    const response = await axiosInstance.put(API.ADMIN.JOB.UPDATE(id), jobData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.data;
}

export const deleteJobByIdAsAdmin = async (id: string, token: string) => {
    const response = await axiosInstance.delete(API.ADMIN.JOB.DELETE(id), {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.data;
}
