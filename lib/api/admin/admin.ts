import axiosInstance from "../axios";
import { API } from "../endpoints";

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

export const getAllUsersAsAdmin = async (token: string, page: number = 1, size: number = 10) => {
    const response = await axiosInstance.get(API.ADMIN.USER.GETALLUSERS, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        params: {
            page,
            size,
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