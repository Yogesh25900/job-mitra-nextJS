"use server";

import { resetPasswordForTalent, resetPasswordForTalentLegacy, sendPasswordResetOtpForTalent, updateTalentProfile, uploadTalentProfilePhoto, verifyOTPForTalent } from "../api/talent-api";
import { resetPasswordForEmployer, resetPasswordForEmployerLegacy, sendPasswordResetOtpForEmployer, verifyOTPForEmployer } from "../api/employer-api";
import { getAuthToken, setUserData } from "../cookie";

export const handleSendPasswordResetOTP = async (email: string, userType: "candidate" | "employer") => {
    try{
        const response = userType === "employer"
            ? await sendPasswordResetOtpForEmployer(email)
            : await sendPasswordResetOtpForTalent(email);
        if(response.success){
            return {
                success: true,
                message: response.message,
                data: response.data
            }
        }
    }
    catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Send OTP action failed'
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
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'OTP verification action failed'
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
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Password reset action failed'
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
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'OTP verification action failed'
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