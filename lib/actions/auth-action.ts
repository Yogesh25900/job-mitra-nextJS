"use server";
import { loginTalent, loginRecruiter, registerRecruiter, registerTalent, getTalentProfileById, getTalentProfileMe, talentProfileEdit, uploadTalentProfilePhoto,  } from "@/lib/api/auth"
import {  LoginTalentInput, LoginRecruiterInput, SignupRecruiterInput, SignupTalentInput } from "@/app/(auth)/schema"
import { setAuthToken, setUserData, clearAuthCookies, getUserData, getAuthToken } from "../cookie"
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const handleTalentRegister = async (data: SignupTalentInput) => {
    try {
        const response = await registerTalent(data)
        console.log('handleTalentRegister response:', response);
        
        if (response.success) {
            return {
                success: true,
                message: response.message || 'Registration successful',
                data: response.data
            }
        }
        return {
            success: false,
            message: response.message || 'Registration failed'
        }
    } catch (error: any) {
        console.error('handleTalentRegister error:', error);
        return { 
            success: false, 
            message: error.message || 'Registration action failed' 
        }
    }
}

export const handleTalentLogin = async (data: LoginTalentInput) => {
    try {
        const response = await loginTalent(data)
        console.log('handleTalentLogin response:', response);
        
        if (response.success) {
            await setAuthToken(response.token)
            await setUserData(response.data)
            return {
                success: true,
                message: response.message || 'Login successful',
                data: response
            }
        }
        return {
            success: false,
            message: response.message || 'Login failed'
        }
    } catch (error: any) {
        console.error('handleTalentLogin error:', error);
        return { 
            success: false, 
            message: error.message || 'Login action failed' 
        }
    }
}


export const handleRecruiterRegister = async (data: SignupRecruiterInput) => {
    try {
        const response = await registerRecruiter(data)
        console.log('handleRecruiterRegister response:', response);
        
        if (response.success) {
            return {
                success: true,
                message: response.message || 'Registration successful',
                data: response.data
            }
        }
        return {
            success: false,
            message: response.message || 'Registration failed'
        }
    } catch (error: any) {
        console.error('handleRecruiterRegister error:', error);
        return { 
            success: false, 
            message: error.message || 'Registration action failed' 
        }
    }
}

export const getCurrentUser = async () => {
    try {
        const userData = await getUserData();
        const token = await getAuthToken();
        
        if (!userData || !token) {
            return null;
        }
        
        return {
            user: userData,
            token
        };
    } catch (error) {
        console.error('getCurrentUser error:', error);
        return null;
    }
}

export const handleRecruiterLogin = async (data: LoginRecruiterInput) => {
    try {
        const response = await loginRecruiter(data)
        console.log('handleRecruiterLogin response:', response);
        
        if (response.success) {
            await setAuthToken(response.token)
            await setUserData(response.data)
            return {
                success: true,
                message: response.message || 'Login successful',
                data: response
            }
        }
        return {
            success: false,
            message: response.message || 'Login failed'
        }
    } catch (error: any) {
        console.error('handleRecruiterLogin error:', error);
        return { 
            success: false, 
            message: error.message || 'Login action failed' 
        }
    }
}

export const handleLogout = async () => {
    await clearAuthCookies();
    revalidatePath('/', 'layout');
    redirect('/login');
}



export const handleCheckAuth = async () => {
    try {
        const userData = await getUserData();
        const token = await getAuthToken();
        
        if (!userData || !token) {
            return {
                authenticated: false,
                user: null
            };
        }
        
        return {
            authenticated: true,
            user: userData
        };
    } catch (error: any) {
        console.error('handleCheckAuth error:', error);
        return {
            authenticated: false,
            user: null
        };
    }
}

export const handleClientLogout = async () => {
    try {
        await clearAuthCookies();
        revalidatePath('/', 'layout');
        return {
            success: true,
            message: 'Logged out successfully'
        };
    } catch (error: any) {
        console.error('handleClientLogout error:', error);
        return {
            success: false,
            message: error.message || 'Logout failed'
        };
    }
}



export const handleGetTalentProfileById = async () => {
    try {
        const token = await getAuthToken();
        if (!token) throw new Error('Unauthorized');
        
        console.log('🔍 [ACTION] handleGetTalentProfileById - Fetching current user profile');
        const userData = await getTalentProfileMe(token);
        console.log('✅ handleGetTalentProfileById userData:', userData);
        
        // getTalentProfileMe returns the user object directly (not wrapped in success/data)
        if (userData) {
            return {
                success: true,
                message: 'Fetch successful',
                data: userData.data
            }
        }
        return {
            success: false,
            message: 'No user data received'
        }
    } catch (error: any) {
        console.error('❌ handleGetTalentProfileById error:', error?.response?.status, error?.message);
        return { 
            success: false, 
            message: error.message || 'Fetch action failed' 
        }
    }
}

export const handleTalentProfileUpdate = async (formData: FormData) => {
    try {
        const token = await getAuthToken();
        const user = await getUserData();
        const id = user?.id || user?._id;
        if (!token) throw new Error('Unauthorized');
        const response = await talentProfileEdit(formData, token, id);
        console.log('handleTalentProfileUpdate response:', response);
        if (response.success) {
            // Update user data in cookies
            await setUserData(response.data);
            return {
                success: true,
                message: 'Profile update successful',
                data: response.data
            }
        }
        return {
            success: false,
            message: response.message || 'Profile update failed'
        }
    } catch (error: any) {
        console.error('handleTalentProfileUpdate error:', error);
        return { 
            success: false, 
            message: error.message || 'Profile update action failed' 
        }
    }
}

export const handleUploadTalentProfilePhoto = async (formData: FormData) => {
    try {
        const token = await getAuthToken();
        console.log('🚀 handleUploadTalentProfilePhoto token:', token);
        if (!token) throw new Error('Unauthorized');
        const response = await uploadTalentProfilePhoto(formData, token);
        console.log('handleUploadTalentProfilePhoto response:', response);
        if (response.success) {
            return {
                success: true,
                message: 'Photo upload successful',
                data: response.data
            }
        }
        return {
            success: false,
            message: response.message || 'Photo upload failed'
        }
    } catch (error: any) {
        console.error('handleUploadTalentProfilePhoto error:', error);
        return { 
            success: false, 
            message: error.message || 'Photo upload action failed' 
        }
    }
}