import { get } from "http";
import axios from "./axios";
import { API } from "./endpoints";
import { getAuthToken } from "../cookie";

export const sendPasswordResetOtpForEmployer = async (email: string) => {
    try {
        const response = await axios.post(API.AUTH.RECRUITER.PASSWORDRESETOTP, { email });
        return response.data;
    } catch (error: any) {
        console.error(' [EMPLOYER API] sendPasswordResetOtpForEmployer error:', error?.response?.status, error?.response?.data || error?.message);
        throw error;
    }
}

// NEW: Verify OTP without resetting password
export const verifyOTPForEmployer = async (email: string, otp: string) => {
    try {
        const response = await axios.post(API.AUTH.RECRUITER.VERIFYOTP, { email, otp });
        return response.data;
    } catch (error: any) {
        console.error('[EMPLOYER API] verifyOTPForEmployer error:', error?.response?.status, error?.response?.data || error?.message);
        throw error;
    }
}

// NEW: Reset password with pre-verified OTP
export const resetPasswordForEmployer = async (
    email: string,
    newPassword: string,
    confirmPassword: string
) => {
    try {
        const response = await axios.post(API.AUTH.RECRUITER.RESETPASSWORD, {
            email,
            newPassword,
            confirmPassword,
        });
        return response.data;
    } catch (error: any) {
        console.error(' [EMPLOYER API] resetPasswordForEmployer error:', error?.response?.status, error?.response?.data || error?.message);
        throw error;
    }
}

// DEPRECATED: Old combined OTP + reset function (kept for backward compatibility)
export const resetPasswordForEmployerLegacy = async (
    email: string,
    otp: string,
    newPassword: string,
    confirmPassword: string
) => {
    try {
        const response = await axios.post(API.AUTH.RECRUITER.RESETPASSWORD, {
            email,
            otp,
            newPassword,
            confirmPassword,
        });
        return response.data;
    } catch (error: any) {
        console.error(' [EMPLOYER API] resetPasswordForEmployerLegacy error:', error?.response?.status, error?.response?.data || error?.message);
        throw error;
    }
}

/**
 * Get employer profile by ID
 */
export const getEmployerProfileById = async (id: string) => {
    try {
        const token = await getAuthToken();

        console.log(' [EMPLOYER API] getEmployerProfileById - Fetching profile for ID:', id);
        const response = await axios.get(`${API.AUTH.RECRUITER.GETPROFILEBYID}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(' [EMPLOYER API] getEmployerProfileById - Success');
        return response.data;
    } catch (error: any) {
        console.error(' [EMPLOYER API] getEmployerProfileById error:', error?.response?.status, error?.response?.data || error?.message);
        throw error;
    }
};

/**
 * Get current logged-in employer profile
 */
export const getEmployerProfileMe = async (token: string) => {
    try {
        console.log(' [EMPLOYER API] getEmployerProfileMe - Making GET request');
        console.log(' [EMPLOYER API] Endpoint:', API.AUTH.RECRUITER.GETPROFILEMYSELF);
        const response = await axios.get(API.AUTH.RECRUITER.GETPROFILEMYSELF, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(' [EMPLOYER API] getEmployerProfileMe - Response received');
        return response.data;
    } catch (error: any) {
        console.error(' [EMPLOYER API] getEmployerProfileMe error:', error?.response?.status, error?.response?.data || error?.message);
        throw error;
    }
};

/**
 * Update employer profile
 */
export const updateEmployerProfile = async (formData: FormData, id: string) => {
    try {
        const token = await getAuthToken();
        console.log(' [EMPLOYER API] updateEmployerProfile called');
        console.log(' [EMPLOYER API] URL:', `${API.AUTH.RECRUITER.EDITPROFILE}/${id}`);
        console.log(' [EMPLOYER API] FormData entries:');
        
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`  - ${key}: File(${value.name}, ${value.size} bytes)`);
            } else {
                const preview = typeof value === 'string' ? value.substring(0, 50) : value;
                console.log(`  - ${key}:`, preview);
            }
        }

        const response = await axios.put(`${API.AUTH.RECRUITER.EDITPROFILE}/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        
        console.log(' [EMPLOYER API] updateEmployerProfile - Response received');
        return response.data;
    } catch (error: any) {
        console.error(' [EMPLOYER API] updateEmployerProfile error:', error?.response?.status, error?.response?.data || error?.message);
        throw error;
    }
};
