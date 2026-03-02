"use server";

import {
  getSavedJobs,
  getSavedJobIds,
  addSavedJob,
  removeSavedJob,
} from "@/lib/api/saved-jobs";
import { getAuthToken } from "@/lib/cookie";

/**
 * Server action to fetch all saved jobs
 */
export async function handleGetSavedJobs(page: number = 1, size: number = 10) {
  try {
      const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        message: 'Authentication token not found. Please log in again.'
      };
    }
    const result = await getSavedJobs(page, size, token);
    return result;
  } catch (error) {
    console.error("[Server Action] handleGetSavedJobs error:", error);
    return {
      success: false,
      error: "Failed to fetch saved jobs",
      jobs: [],
      total: 0,
      page: 1,
      size: 10,
      totalPages: 0,
    };
  }
}

/**
 * Server action to get saved job IDs
 */
export async function handleGetSavedJobIds() {
  try {
      const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        message: 'Authentication token not found. Please log in again.'
      };
    }
    const result = await getSavedJobIds(token);
    return result;
  } catch (error) {
    console.error("[Server Action] handleGetSavedJobIds error:", error);
    return {
      success: false,
      error: "Failed to fetch saved job IDs",
      savedJobIds: [],
    };
  }
}

/**
 * Server action to add a job to saved list
 */
export async function handleAddSavedJob(jobId: string) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        message: 'Authentication token not found. Please log in again.'
      };
    }
        
    const result = await addSavedJob(jobId, token);
    return result;
  } catch (error) {
    console.error("[Server Action] handleAddSavedJob error:", error);
    return {
      success: false,
      error: "Failed to save job",
    };
  }
}

/**
 * Server action to remove a job from saved list
 */
export async function handleRemoveSavedJob(jobId: string) {
  try {
     const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        message: 'Authentication token not found. Please log in again.'
      };
    }
    const result = await removeSavedJob(jobId,token);
    return result;
  } catch (error) {
    console.error("[Server Action] handleRemoveSavedJob error:", error);
    return {
      success: false,
      error: "Failed to remove saved job",
    };
  }
}
