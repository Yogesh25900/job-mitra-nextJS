"use server";

import { getAllJobs, getJobById, searchJobs, getEmployerJobs } from '@/lib/api/job';

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

export const handleSearchJobs = async (filters: any, page: number = 1, size: number = 10) => {
    try {
        const response = await searchJobs(filters, page, size);
        console.log('handleSearchJobs response:', response);
        
        if (response.success) {
            return {
                success: true,
                message: 'Search successful',
                data: response.data,
                metadata: response.metadata,
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

export const handleGetEmployerJobs = async (page: number = 1, size: number = 5, searchQuery?: string) => {
    try {
        const response = await getEmployerJobs(page, size, searchQuery);
        
        if (response.success) {
            return {
                success: true,
                message: 'Fetch successful',
                data: response.data,
                metadata: {
                    total: response.total,
                    page: response.page,
                    size: response.size,
                    totalPages: response.totalPages,
                }
            }
        }
        return {
            success: false,
            message: response.message || 'Fetch failed',
            data: []
        }
    } catch (error) {
        return { 
            success: false, 
            message: error instanceof Error ? error.message : 'Fetch action failed',
            data: []
        }
    }
}
