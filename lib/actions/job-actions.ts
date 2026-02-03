"use server";

import { getAllJobs, getJobById, searchJobs } from '@/lib/api/job';

export const handleGetAllJobs = async (page: number = 1, size: number = 10) => {
    try {
        const response = await getAllJobs(page, size);
        console.log('handleGetAllJobs response:', response);
        
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
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Fetch action failed' 
        }
    }
}

export const handleGetJobById = async (id: string) => {
    try {
        const response = await getJobById(id);
        
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

export const handleSearchJobs = async (filters: any) => {
    try {
        const response = await searchJobs(filters);
        
        if (response.success) {
            return {
                success: true,
                message: 'Search successful',
                data: response.data
            }
        }
        return {
            success: false,
            message: response.message || 'Search failed'
        }
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Search action failed' 
        }
    }
}
