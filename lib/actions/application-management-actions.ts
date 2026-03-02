"use server";

import { getMyApplications, getApplicationById, deleteJobApplication } from "@/lib/api/applications";
import { getAuthToken } from "../cookie";

/**
 * Fetch all applications submitted by the current user with pagination
 */
export const handleGetMyApplications = async (page: number = 1, size: number = 5) => {
    try {
        const token = await getAuthToken();
        if (!token) {
            return {
                success: false,
                message: 'Authentication token not found. Please log in again.'
            }
        }
        
        console.log('[ACTION] handleGetMyApplications - Fetching user applications', {page, size});
        const response = await getMyApplications(token, page, size);
        
        if (response.success) {
            return {
                success: true,
                message: 'Applications fetched successfully',
                data: response.data,
            }
        }
        return {
            success: false,
            message: response.message || 'Failed to fetch applications'
        }
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Fetch action failed' 
        }
    }
}

/**
 * Fetch a single application by ID
 */
export const handleGetApplicationById = async (applicationId: string) => {
    try {
        const token = await getAuthToken();
        if (!token) {
            return {
                success: false,
                message: 'Authentication token not found. Please log in again.'
            }
        }
        console.log(' [ACTION] handleGetApplicationById - Fetching application:', applicationId);
        const response = await getApplicationById(applicationId);
        
        if (response.success) {
            return {
                success: true,
                message: 'Application fetched successfully',
                data: response.data,
            }
        }
        return {
            success: false,
            message: response.message || 'Failed to fetch application'
        }
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Fetch action failed' 
        }
    }
}

/**
 * Delete a job application
 */
export const handleDeleteJobApplication = async (applicationId: string) => {
    try {
          const token = await getAuthToken();
        if (!token) {
            return {
                success: false,
                message: 'Authentication token not found. Please log in again.'
            }
        }
        console.log(' [ACTION] handleDeleteJobApplication - Deleting application:', applicationId);
        const response = await deleteJobApplication(applicationId, token);
        
        if (response.success) {
            return {
                success: true,
                message: response.message || 'Application deleted successfully',
            }
        }
        return {
            success: false,
            message: response.message || 'Failed to delete application'
        }
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Delete action failed' 
        }
    }
}
