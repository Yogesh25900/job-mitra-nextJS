"use server";

import { createUserAsAdmin, getAllUsersAsAdmin, getUserByIdAsAdmin, updateUserByIdAsAdmin, deleteUserByIdAsAdmin } from '@/lib/api/admin/admin';
import { loginAdmin } from '@/lib/api/auth';
import { getAuthToken, setAuthToken, setUserData } from '@/lib/cookie';
import { revalidatePath } from 'next/cache'

export const handleAdminLogin = async (data: any) => {
    try {
        const response = await loginAdmin(data)
        console.log('handleAdminLogin response:', response);
        
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
        console.error('handleAdminLogin error:', error);
        return { 
            success: false, 
            message: error.message || 'Login action failed' 
        }
    }
}

export const handleCreateUserAsAdmin = async (userData: any) => {
    try{
        
    const token = await getAuthToken();
    if (!token) throw new Error('Unauthorized');
    const response = await createUserAsAdmin(userData, token);
    if(response.success){
        revalidatePath('/admin/users');
        return {
                success: true,
                message: 'Registration successful',
                data: response.data
            }
    }
     return {
            success: false,
            message: response.message || 'Registration failed'
        }
    } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'Registration action failed' }
    }

}
    export const handleGetAllUsersAsAdmin = async () => {
    try{
        
    const token = await getAuthToken();
    
    if (!token) throw new Error('Unauthorized');
    const response = await getAllUsersAsAdmin(token);
    console.log('handleGetAllUsersAsAdmin response:', response);
    if(response.success){
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
    }
    catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'Fetch action failed' }
    }

}
    export const handleGetUserByIdAsAdmin = async (id: string) => {
    try{
        
    const token = await getAuthToken();
    if (!token) throw new Error('Unauthorized');
    const response = await getUserByIdAsAdmin(id, token);   
    if(response.success){
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
    }
    catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'Fetch action failed' }
    }
    }


export const handleUpdateUserByIdAsAdmin = async (id: string, userData: any) => {
    try{
        
    const token = await getAuthToken(); 
    if (!token) throw new Error('Unauthorized');
    const response = await updateUserByIdAsAdmin(id, userData, token);
    if(response.success){
        revalidatePath('/admin/users');
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
        return { success: false, message: error instanceof Error ? error.message : 'Update action failed' }
    }
}



export const handleDeleteUserByIdAsAdmin = async (id: string) => {
    try{
    const token = await getAuthToken();
    if (!token) throw new Error('Unauthorized');
    const response = await deleteUserByIdAsAdmin(id, token);
    if(response.success){
        revalidatePath('/admin/users');
        return {
                success: true,
                message: 'Deletion successful',
                data: response.data
            }

    }
        return {
            success: false,
            message: response.message || 'Deletion failed'
        }
    }
    catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'Deletion action failed' }
    }
}
