"use server";
import { loginTalent, registerRecruiter, registerTalent } from "@/lib/api/auth"
import {  LoginTalentInput, SignupRecruiterInput, SignupTalentInput } from "@/app/(auth)/schema"
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

export const handleLogout = async () => {
    await clearAuthCookies();
    revalidatePath('/', 'layout');
    return redirect('/login');
}