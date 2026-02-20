"use server";

import { resetPasswordForTalent, resetPasswordForTalentLegacy, sendPasswordResetOtpForTalent, updateTalentProfile, uploadTalentProfilePhoto, verifyOTPForTalent } from "../api/talent-api";
import { resetPasswordForEmployer, resetPasswordForEmployerLegacy, sendPasswordResetOtpForEmployer, verifyOTPForEmployer } from "../api/employer-api";
import { getAuthToken, setUserData } from "../cookie";

const extractFirstReadableMessage = (value: unknown): string | null => {
    if (typeof value === 'string' && value.trim().length > 0) {
        return value.trim();
    }

    if (Array.isArray(value)) {
        for (const item of value) {
            const message = extractFirstReadableMessage(item);
            if (message) return message;
        }
        return null;
    }

    if (value && typeof value === 'object') {
        for (const nestedValue of Object.values(value as Record<string, unknown>)) {
            const message = extractFirstReadableMessage(nestedValue);
            if (message) return message;
        }
    }

    return null;
};

const getActionErrorMessage = (error: unknown, fallback: string): string => {
    const err = error as any;

    const candidates: unknown[] = [
        err?.response?.data?.message,
        err?.response?.data?.error,
        err?.response?.data?.data?.message,
        err?.message,
    ];

    for (const candidate of candidates) {
        const message = extractFirstReadableMessage(candidate);
        if (message) return message;
    }

    return fallback;
};

export const handleSendPasswordResetOTP = async (email: string, userType: "candidate" | "employer") => {
    try{
        const response = userType === "employer"
            ? await sendPasswordResetOtpForEmployer(email)
            : await sendPasswordResetOtpForTalent(email);

        if(response?.success){
            return {
                success: true,
                message: response.message,
                data: response.data
            }
        }

        return {
            success: false,
            message: extractFirstReadableMessage(response?.message) || 'Unable to send OTP. Please try again.'
        }
    }
    catch (error: unknown) {
        return {
            success: false,
            message: getActionErrorMessage(error, 'Unable to send OTP right now. Please try again.')
        }
    }
}

// NEW: Verify OTP (Step 2 - separate from password reset)
export const handleVerifyOTP = async (
    email: string,
    otp: string,
    userType: "candidate" | "employer"
) => {
    try {
        const response = userType === "employer"
            ? await verifyOTPForEmployer(email, otp)
            : await verifyOTPForTalent(email, otp);
        
        if (response.success) {
            return {
                success: true,
                message: response.message,
                email: response.data?.email || email,
            }
        }
        return {
            success: false,
            message: response.message || 'OTP verification failed'
        }
    } catch (error: unknown) {
        return {
            success: false,
            message: getActionErrorMessage(error, 'OTP verification failed. Please try again.')
        }
    }
}

// NEW: Reset password (Step 3 - only password submission)
export const handleResetPassword = async (
    email: string,
    newPassword: string,
    confirmPassword: string,
    userType: "candidate" | "employer"
) => {
    try {
        const response = userType === "employer"
            ? await resetPasswordForEmployer(email, newPassword, confirmPassword)
            : await resetPasswordForTalent(email, newPassword, confirmPassword);
        
        if (response.success) {
            return {
                success: true,
                message: response.message,
            }
        }
        return {
            success: false,
            message: response.message ||  'Password reset failed'
        }
    } catch (error: unknown) {
        return {
            success: false,
            message: getActionErrorMessage(error, 'Password reset failed. Please try again.')
        }
    }
}

// DEPRECATED: Old combined OTP + reset handler (kept for backward compatibility)
export const handleVerifyOTPAndResetPassword = async (
    email: string,
    otp: string,
    newPassword: string,
    confirmPassword: string,
    userType: "candidate" | "employer"
) => {
    try {
        const response = userType === "employer"
            ? await resetPasswordForEmployerLegacy(email, otp, newPassword, confirmPassword)
            : await resetPasswordForTalentLegacy(email, otp, newPassword, confirmPassword);
        if (response.success) {
            return {
                success: true,
                message: response.message,
            }
        }
        return {
            success: false,
            message: response.message || 'OTP verification failed'
        }
    } catch (error: unknown) {
        return {
            success: false,
            message: getActionErrorMessage(error, 'OTP verification failed. Please try again.')
        }
    }
}

export const handleTalentPhotoUpdate = async (formData: FormData) => {
    try {
        const token = await getAuthToken();
        if(!token){
            return {
                success: false,
                message: 'User not authenticated'
            }
        }
        const response = await uploadTalentProfilePhoto(formData, token);
        
        if (response.success) {
            return {
                success: true,
                message: 'Fetch successful',
                data: response.data
            }
        }
        return {
            success: false,
            message: response.message || 'Fetch failed'
        }
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Fetch action failed' 
        }
    }
}


export const handleTalentProfileUpdate = async (formData: FormData, id: string) => {
    try {
        const token = await getAuthToken();
        if(!token){
            return {
                success: false,
                message: 'User not authenticated'
            }
        }
        const response = await updateTalentProfile(formData, id);
        if (response.success) {
            await setUserData(response.data);
            return {
                success: true,
                message: 'Update successful',
                data: response.data
            }
        }
        return {
            success: false,
            message: response.message || 'Update failed'
        }
    }
    catch (error) {
        return { 
            success: false,
            message: error instanceof Error ? error.message : 'Update action failed' 
        }
    }
}