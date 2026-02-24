import axiosInstance from "../axios";
import { API } from "../endpoints";

export const getAdminProfile = async (token: string) => {
    const response = await axiosInstance.get(API.ADMIN.PROFILE.GETME, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.data;
}

export const updateAdminProfile = async (
    profileData: {
        fname?: string;
        lname?: string;
        email?: string;
        phoneNumber?: string;
        location?: string;
    },
    token: string
) => {
    const response = await axiosInstance.put(API.ADMIN.PROFILE.UPDATE, profileData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.data;
}

export const changeAdminPassword = async (
    passwordData: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    },
    token: string
) => {
    const response = await axiosInstance.put(API.ADMIN.PROFILE.CHANGE_PASSWORD, passwordData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.data;
}

export const createUserAsAdmin = async (userData: any, token: string) => {
    // If there's a base64 image, we need to send as FormData
    if (userData.profilePictureBase64) {
        const formData = new FormData();
        
        // Add all fields except the base64
        const { profilePictureBase64, profilePictureName, ...restData } = userData;
        Object.entries(restData).forEach(([key, value]) => {
            formData.append(key, value as string);
        });
        
        // Convert base64 to Blob
        const response = await fetch(userData.profilePictureBase64);
        const blob = await response.blob();
        const file = new File([blob], profilePictureName || 'profilePicture', { type: blob.type });
        formData.append('profilePicture', file);

        const axiosResponse = await axiosInstance.post(API.ADMIN.USER.CREATE, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                // Let axios set the Content-Type with boundary
            },
        });
        return axiosResponse.data;
    }

    // Otherwise send as JSON
    const response = await axiosInstance.post(API.ADMIN.USER.CREATE, userData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.data;
}

export const getAllUsersAsAdmin = async (
    token: string,
    page: number = 1,
    size: number = 10,
    search: string = '',
    role: string = 'All'
) => {
    const response = await axiosInstance.get(API.ADMIN.USER.GETALLUSERS, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        params: {
            page,
            size,
            search,
            role,
        },
    });
    console.log('getAllUsersAsAdmin response:', response);
    return response.data;
}

export const getUserByIdAsAdmin = async (id: string, token: string) => {
    const response = await axiosInstance.get(API.ADMIN.USER.GETUSERBYID(id), {  
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.data;
}

export const updateUserByIdAsAdmin = async (id: string, userData: any, token: string) => {
    // If there's a base64 image, we need to send as FormData
    if (userData.profilePictureBase64) {
        const formData = new FormData();
        
        // Add all fields except the base64
        const { profilePictureBase64, profilePictureName, ...restData } = userData;
        Object.entries(restData).forEach(([key, value]) => {
            formData.append(key, value as string);
        });
        
        // Convert base64 to Blob
        const response = await fetch(userData.profilePictureBase64);
        const blob = await response.blob();
        const file = new File([blob], profilePictureName || 'profilePicture', { type: blob.type });
        formData.append('profilePicture', file);

        const axiosResponse = await axiosInstance.put(API.ADMIN.USER.UPDATEUSERBYID(id), formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                // Let axios set the Content-Type with boundary
            },
        });
        return axiosResponse.data;
    }

    // Otherwise send as JSON
    const response = await axiosInstance.put(API.ADMIN.USER.UPDATEUSERBYID(id), userData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.data;
}

export const deleteUserByIdAsAdmin = async (id: string, token: string) => {
    const response = await axiosInstance.delete(API.ADMIN.USER.DELETEUSERBYID(id), {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.data;
}

// Dashboard API functions
export const getDashboardStats = async (token: string) => {
    try {
        const response = await axiosInstance.get(API.ADMIN.DASHBOARD.GETSTATS, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log('getDashboardStats response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('getDashboardStats error:', error.response?.data || error.message);
        throw error;
    }
}

export const getJobPostingTrends = async (token: string) => {
    try {
        const response = await axiosInstance.get(API.ADMIN.DASHBOARD.GETTRENDS, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log('getJobPostingTrends response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('getJobPostingTrends error:', error.response?.data || error.message);
        throw error;
    }
}

export const getRecentActivities = async (token: string, limit: number = 50, skip: number = 0) => {
    try {
        const response = await axiosInstance.get(API.ADMIN.DASHBOARD.GETACTIVITIES, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            params: {
                limit,
                skip,
            },
        });
        console.log('getRecentActivities response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('getRecentActivities error:', error.response?.data || error.message);
        throw error;
    }
}