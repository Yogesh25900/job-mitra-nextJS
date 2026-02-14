import { getAuthToken } from "../cookie";
import axios from "./axios";
import { API } from "./endpoints";

export const sendPasswordResetOtpForTalent = async (email: string) => {
    try {
        const response = await axios.post(API.AUTH.TALENT.PASSWORDRESETOTP, { email });
        return response.data;
    }
    catch (error: any) {
        console.error(' [TALENT API] sendPasswordResetOtpForTalent error:', error?.response?.status, error?.response?.data || error?.message);
        throw error;
    }
}

// NEW: Verify OTP without resetting password
export const verifyOTPForTalent = async (email: string, otp: string) => {
    try {
        const response = await axios.post(API.AUTH.TALENT.VERIFYOTP, { email, otp });
        return response.data;
    }
    catch (error: any) {
        console.error(' [TALENT API] verifyOTPForTalent error:', error?.response?.status, error?.response?.data || error?.message);
        throw error;
    }
}

// NEW: Reset password with pre-verified OTP
export const resetPasswordForTalent = async (
    email: string,
    newPassword: string,
    confirmPassword: string
) => {
    try {
        const response = await axios.post(API.AUTH.TALENT.RESETPASSWORD, {
            email,
            newPassword,
            confirmPassword,
        });
        return response.data;
    } catch (error: any) {
        console.error(' [TALENT API] resetPasswordForTalent error:', error?.response?.status, error?.response?.data || error?.message);
        throw error;
    }
}

// DEPRECATED: Old combined OTP + reset function (kept for backward compatibility)
export const resetPasswordForTalentLegacy = async (
    email: string,
    otp: string,
    newPassword: string,
    confirmPassword: string
) => {
    try {
        const response = await axios.post(API.AUTH.TALENT.RESETPASSWORD, {
            email,
            otp,
            newPassword,
            confirmPassword,
        });
        return response.data;
    } catch (error: any) {
        console.error(' [TALENT API] resetPasswordForTalentLegacy error:', error?.response?.status, error?.response?.data || error?.message);
        throw error;
    }
}

/**
 * Get talent profile by ID
 */
export const getTalentProfileById = async ( id: string) => {
    try {
        const token = await getAuthToken();
        console.log(' [TALENT API] getTalentProfileById - Fetching profile for ID:', id);
        const response = await axios.get(`${API.AUTH.TALENT.GETPROFILEBYID}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(' [TALENT API] getTalentProfileById - Success');
        return response.data;
    } catch (error: any) {
        console.error(' [TALENT API] getTalentProfileById error:', error?.response?.status, error?.response?.data || error?.message);
        throw error;
    }
};

/**
 * Get current logged-in talent profile
 */
export const getTalentProfileMe = async (token: string) => {
    try {
        console.log(' [TALENT API] getTalentProfileMe - Making GET request');
        console.log(' [TALENT API] Endpoint:', API.AUTH.TALENT.GETPROFILEMYSELF);
        const response = await axios.get(API.AUTH.TALENT.GETPROFILEMYSELF, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(' [TALENT API] getTalentProfileMe - Response received');
        return response.data;
    } catch (error: any) {
        console.error(' [TALENT API] getTalentProfileMe error:', error?.response?.status, error?.response?.data || error?.message);
        throw error;
    }
};

/**
 * Update talent profile
 */
export const updateTalentProfile = async (formData: FormData, id: string) => {
    try {
        const token = await getAuthToken();
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`  - ${key}: File(${value.name}, ${value.size} bytes)`);
            } else {
                const preview = typeof value === 'string' ? value.substring(0, 50) : value;
                console.log(`  - ${key}:`, preview);
            }
        }

        const response = await axios.put(`${API.AUTH.TALENT.EDITPROFILE}/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        
        console.log(' [TALENT API] updateTalentProfile - Response received');
        return response.data;
    } catch (error: any) {
        console.error(' [TALENT API] updateTalentProfile error:', error?.response?.status, error?.response?.data || error?.message);
        throw error;
    }
};

/**
 * Upload talent profile photo
 */
export const uploadTalentProfilePhoto = async (formData: FormData, token: string) => {
    try {
        console.log(' [TALENT API] uploadTalentProfilePhoto called');
        const response = await axios.post(API.AUTH.TALENT.UPLOADPHOTO, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        
        console.log(' [TALENT API] uploadTalentProfilePhoto - Response received');
        return response.data;
    } catch (error: any) {
        console.error(' [TALENT API] uploadTalentProfilePhoto error:', error?.response?.status, error?.response?.data || error?.message);
        throw error;
    }
};

