import { JobsApiResponse, Job } from "../types/job";
import axiosInstance from './axios';

/**
 * Get all saved jobs for the authenticated user
 * @param page - Page number (1-indexed)
 * @param size - Number of items per page
 */
export async function getSavedJobs(page: number = 1, size: number = 10,token: string): Promise<JobsApiResponse> {
  try {
    const response = await axiosInstance.get<{
      success: boolean;
      message: string;
      data: {
        data: Job[];
        total: number;
        page: number;
        size: number;
        totalPages: number;
      };
    }>("/api/saved-jobs/list", {
      params: {
        page,
        size,
      },
      headers: {
                Authorization: `Bearer ${token}`,
            },
    });

    console.log("[API] getSavedJobs response:", response.data);

    if (response.data.success) {
      return {
        success: true,
        jobs: response.data.data.data,
        total: response.data.data.total,
        page: response.data.data.page,
        size: response.data.data.size,
        totalPages: response.data.data.totalPages,
      };
    }

    return {
      success: false,
      error: response.data.message || "Failed to fetch saved jobs",
      jobs: [],
      total: 0,
      page: 1,
      size: 10,
      totalPages: 0,
    };
  } catch (error: any) {
    console.error("[API] getSavedJobs error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch saved jobs";
    return {
      success: false,
      error: errorMessage,
      jobs: [],
      total: 0,
      page: 1,
      size: 10,
      totalPages: 0,
    };
  }
}

/**
 * Get IDs of all saved jobs (for quick checking)
 */
export async function getSavedJobIds(token: string) {
  try {
    const response = await axiosInstance.get<{
      success: boolean;
      message: string;
      data: {
        savedJobIds: string[];
      };
    }>("/api/saved-jobs/ids/list",{
         headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("[API] getSavedJobIds response:", response.data);

    if (response.data.success) {
      return {
        success: true,
        savedJobIds: response.data.data.savedJobIds,
      };
    }

    return {
      success: false,
      error: response.data.message || "Failed to fetch saved job IDs",
      savedJobIds: [],
    };
  } catch (error: any) {
    console.error("[API] getSavedJobIds error:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch saved job IDs",
      savedJobIds: [],
    };
  }
}

/**
 * Add a job to the user's saved list
 * @param jobId - ID of the job to save
 * @param token - Authentication token
 */
export async function addSavedJob(jobId: string, token: string) {
  try {
    const response = await axiosInstance.post<{
      success: boolean;
      message: string;
      data?: any;
    }>("/api/saved-jobs/add", { jobId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("[API] addSavedJob response:", response.data);

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
      };
    }

    return {
      success: false,
      error: response.data.message || "Failed to save job",
    };
  } catch (error: any) {
    console.error("[API] addSavedJob error:", error);
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to save job";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Remove a job from the user's saved list
 * @param jobId - ID of the job to remove
 */
export async function removeSavedJob(jobId: string,token: string) {
  try {
    const response = await axiosInstance.delete<{
      success: boolean;
      message: string;
    }>(`/api/saved-jobs/${jobId}`,{
         headers: {
                Authorization: `Bearer ${token}`,
            },
    }
        
    );

    console.log("[API] removeSavedJob response:", response.data);

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
      };
    }

    return {
      success: false,
      error: response.data.message || "Failed to remove saved job",
    };
  } catch (error: any) {
    console.error("[API] removeSavedJob error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to remove saved job";
    return {
      success: false,
      error: errorMessage,
    };
  }
}
