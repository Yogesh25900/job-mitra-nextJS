"use server";

import { createUserAsAdmin, getAllUsersAsAdmin, getUserByIdAsAdmin, updateUserByIdAsAdmin, deleteUserByIdAsAdmin, getDashboardStats, updateAdminProfile, changeAdminPassword } from '@/lib/api/admin/admin';
import { getAllJobsAsAdmin, getJobByIdAsAdmin, createJobAsAdmin, updateJobByIdAsAdmin, deleteJobByIdAsAdmin, getJobStatsAsAdmin } from '@/lib/api/admin/jobs';
import { loginAdmin } from '@/lib/api/auth';
import { getAllCategories } from '@/lib/api/category';
import { getAuthToken, getUserData, setAuthToken, setUserData } from '@/lib/cookie';
import { revalidatePath } from 'next/cache'

export const handleAdminLogin = async (data: any) => {
    try {
        console.log('[SERVER] Starting admin login with email:', data.email);
        const response = await loginAdmin(data)
        console.log('[SERVER] Login API response:', response);
        console.log('[SERVER] Response data:', response?.data);
        console.log('[SERVER] Response data role:', response?.data?.role);
        
        if (response.success) {
            console.log('[SERVER] Login successful, storing user data and token');
            await setAuthToken(response.token)
            console.log('[SERVER] Token set');
            
            console.log('[SERVER] Setting user data:', response.data);
            await setUserData(response.data)
            console.log('[SERVER] User data set');
            
            // Revalidate the auth check path to ensure AuthContext picks up changes
            console.log('[SERVER] Revalidating cache');
            revalidatePath('/', 'layout')
            console.log('[SERVER] Cache revalidated');
            
            return {
                success: true,
                message: response.message || 'Login successful',
                data: response
            }
        }
        console.log('[SERVER] Login failed:', response.message);
        return {
            success: false,
            message: response.message || 'Login failed'
        }
    } catch (error: any) {
        console.error('[SERVER] handleAdminLogin error:', error);
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
    export const handleGetAllUsersAsAdmin = async (
        page: number = 1,
        size: number = 10,
        search: string = '',
        role: string = 'All'
    ) => {
    try{
        
    const token = await getAuthToken();
    
    if (!token) throw new Error('Unauthorized');
    const response = await getAllUsersAsAdmin(token, page, size, search, role);
    console.log('handleGetAllUsersAsAdmin response:', response);
    if(response.success){
        return {
                success: true,
                message: 'Fetch successful',
                data: response.data,
                metadata: response.metadata,
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

export const handleGetDashboardStatsAsAdmin = async () => {
    try {
        const token = await getAuthToken();
        if (!token) throw new Error('Unauthorized');

        const response = await getDashboardStats(token);
        if (response.success) {
            return {
                success: true,
                message: 'Fetch successful',
                data: response.data,
            }
        }

        return {
            success: false,
            message: response.message || 'Fetch failed',
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Fetch action failed',
        }
    }
}

export const handleUpdateAdminProfile = async (profileData: {
    fname?: string;
    lname?: string;
    email?: string;
    phoneNumber?: string;
    location?: string;
}) => {
    try {
        const token = await getAuthToken();
        if (!token) throw new Error('Unauthorized');

        const response = await updateAdminProfile(profileData, token);
        if (response.success && response.data) {
            const existingUser = await getUserData();
            await setUserData({
                ...(existingUser || {}),
                ...response.data,
            });
            revalidatePath('/admin/profile');
            revalidatePath('/', 'layout');
            return {
                success: true,
                message: response.message || 'Profile updated successfully',
                data: response.data,
            };
        }

        return {
            success: false,
            message: response.message || 'Profile update failed',
        };
    } catch (error: any) {
        return {
            success: false,
            message: error?.response?.data?.message || error.message || 'Profile update action failed',
        };
    }
}

export const handleChangeAdminPassword = async (passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}) => {
    try {
        const token = await getAuthToken();
        if (!token) throw new Error('Unauthorized');

        const response = await changeAdminPassword(passwordData, token);
        if (response.success) {
            return {
                success: true,
                message: response.message || 'Password changed successfully',
            };
        }

        return {
            success: false,
            message: response.message || 'Password change failed',
        };
    } catch (error: any) {
        return {
            success: false,
            message: error?.response?.data?.message || error.message || 'Password change action failed',
        };
    }
}

// ============ JOB MANAGEMENT SERVER ACTIONS ============

export const handleGetAllJobsAsAdmin = async (
    page: number = 1,
    size: number = 10,
    search: string = '',
    status: string = 'All'
) => {
    try {
        const token = await getAuthToken();
        if (!token) {
            console.error('[SERVER] No auth token found');
            throw new Error('Unauthorized');
        }
        console.log('[SERVER] Fetching jobs with params:', { page, size, search, status });
        const response = await getAllJobsAsAdmin(token, page, size, search, status);
        console.log('[SERVER] Jobs API response:', response);
        
        if (response.success) {
            return {
                success: true,
                message: 'Fetch successful',
                data: response.data,
                metadata: response.metadata,
            }
        }
        return {
            success: false,
            message: response.message || 'Fetch failed'
        }
    } catch (error) {
        console.error('[SERVER] handleGetAllJobsAsAdmin error:', error);
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Fetch action failed' 
        }
    }
}

export const handleGetJobStatsAsAdmin = async () => {
    try {
        const token = await getAuthToken();
        if (!token) {
            console.error('[SERVER] No auth token found for stats');
            throw new Error('Unauthorized');
        }
        console.log('[SERVER] Fetching job stats');
        const response = await getJobStatsAsAdmin(token);
        console.log('[SERVER] Stats API response:', response);
        
        if (response.success) {
            return {
                success: true,
                message: 'Stats fetched successfully',
                data: response.data
            }
        }
        return {
            success: false,
            message: response.message || 'Failed to fetch stats',
            data: null
        }
    } catch (error) {
        console.error('[SERVER] handleGetJobStatsAsAdmin error:', error);
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Failed to fetch stats',
            data: null
        }
    }
}

export const handleGetJobByIdAsAdmin = async (id: string) => {
    try {
        const token = await getAuthToken();
        if (!token) throw new Error('Unauthorized');
        const response = await getJobByIdAsAdmin(id, token);
        
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
        return { success: false, message: error instanceof Error ? error.message : 'Fetch action failed' }
    }
}

export const handleCreateJobAsAdmin = async (jobData: any) => {
    try {
        const token = await getAuthToken();
        if (!token) throw new Error('Unauthorized');
        const response = await createJobAsAdmin(jobData, token);
        
        if (response.success) {
            revalidatePath('/admin/jobs');
            return {
                success: true,
                message: 'Job created successfully',
                data: response.data
            }
        }
        return {
            success: false,
            message: response.message || 'Creation failed'
        }
    } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'Creation action failed' }
    }
}

export const handleUpdateJobByIdAsAdmin = async (id: string, jobData: any) => {
    try {
        const token = await getAuthToken();
        if (!token) throw new Error('Unauthorized');
        const response = await updateJobByIdAsAdmin(id, jobData, token);
        
        if (response.success) {
            revalidatePath('/admin/jobs');
            return {
                success: true,
                message: 'Job updated successfully',
                data: response.data
            }
        }
        return {
            success: false,
            message: response.message || 'Update failed'
        }
    } catch (error) {
        console.log('handleUpdateJobByIdAsAdmin error:', error);
        return { success: false, message: error instanceof Error ? error.message : 'Update action failed' }
    }
}

export const handleDeleteJobByIdAsAdmin = async (id: string) => {
    try {
        const token = await getAuthToken();
        if (!token) throw new Error('Unauthorized');
        const response = await deleteJobByIdAsAdmin(id, token);
        
        if (response.success) {
            revalidatePath('/admin/jobs');
            return {
                success: true,
                message: 'Job deleted successfully',
                data: response.data
            }
        }
        return {
            success: false,
            message: response.message || 'Deletion failed'
        }
    } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'Deletion action failed' }
    }
}

export const handleGetAllCategories = async () => {
    try {
        console.log('[SERVER] Fetching all categories');
        const response = await getAllCategories();
        
        if (response.success) {
            console.log('[SERVER] Categories fetched successfully:', response.data?.length || 0, 'categories');
            return {
                success: true,
                message: 'Categories fetched successfully',
                data: response.data || [],
                total: response.total || 0
            }
        }
        console.log('[SERVER] Failed to fetch categories:', response.message);
        return {
            success: false,
            message: response.message || 'Failed to fetch categories',
            data: []
        }
    } catch (error) {
        console.error('[SERVER] handleGetAllCategories error:', error);
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Failed to fetch categories',
            data: []
        }
    }
}
