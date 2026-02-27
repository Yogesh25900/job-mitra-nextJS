"use server";

import { getRecommendedJobs } from '@/lib/api/recommendations';
import { handleCheckAuth } from './auth-action';

export const handleGetRecommendedJobs = async (topN: number = 10, threshold?: number) => {
    try {
        // Get the logged-in user's ID
        const authResult = await handleCheckAuth();
        
        if (!authResult?.authenticated || !authResult?.user) {
            return {
                success: false,
                message: 'Not authenticated',
                data: []
            };
        }

        const candidateId = authResult.user._id || authResult.user.id;
        
        if (!candidateId) {
            return {
                success: false,
                message: 'User ID not found',
                data: []
            };
        }

        const response = await getRecommendedJobs(candidateId, topN, threshold);
        
        console.log('Recommendations response:', response);
        
        // The API returns an array of recommended jobs directly
        if (Array.isArray(response)) {
            return {
                success: true,
                message: 'Recommendations fetched successfully',
                data: response
            };
        } else if (response.success !== false) {
            return {
                success: true,
                message: 'Recommendations fetched successfully',
                data: response.data || response
            };
        }

        return {
            success: false,
            message: response.message || 'Failed to fetch recommendations',
            data: []
        };
    } catch (error) {
        console.error('Recommendation fetch error:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch recommendations',
            data: []
        };
    }
};
