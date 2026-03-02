"use server";

import {
  submitFeedback,
  getUserFeedback,
  getFeedbackById,
  getAdminFeedback,
  getAdminFeedbackStats,
  updateAdminFeedback,
  deleteAdminFeedback,
} from "@/lib/api/feedback";
import { getAuthToken } from "@/lib/cookie";

/**
 * Handle feedback submission
 * Pattern: UI → Action → API
 * Auth: Gets token from server-side cookies
 * Backend: POST /api/feedback
 */
export const handleSubmitFeedback = async (
  formData: FormData
) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        message: "Authentication required. Please login first.",
      };
    }

    console.log("[ACTION] handleSubmitFeedback - Submitting feedback");

    const response = await submitFeedback(formData);

    if (response.success) {
      return {
        success: true,
        message: response.message || "Feedback submitted successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to submit feedback",
    };
  } catch (error: any) {
    console.error("[ACTION] handleSubmitFeedback error:", error);
    return {
      success: false,
      message: error.message || "Feedback submission failed",
    };
  }
};

/**
 * Fetch user's own feedback
 * Pattern: UI → Action → API
 * Auth: Gets token from server-side cookies
 * Backend: GET /api/feedback/my-feedback
 */
export const handleGetMyFeedback = async (
  page: number = 1,
  size: number = 10
) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        message: "Authentication required. Please login first.",
      };
    }

    console.log("[ACTION] handleGetMyFeedback - Fetching user feedback", {
      page,
      size,
    });

    const response = await getUserFeedback(page, size);

    if (response.success) {
      return {
        success: true,
        message: "Feedback fetched successfully",
        data: response.data,
        metadata: response.metadata,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to fetch feedback",
    };
  } catch (error: any) {
    console.error("[ACTION] handleGetMyFeedback error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch feedback",
      data: [],
    };
  }
};

/**
 * Fetch a specific feedback by ID
 * Pattern: UI → Action → API
 * Auth: Gets token from server-side cookies
 * Backend: GET /api/feedback/:id
 */
export const handleGetFeedbackById = async (id: string) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        message: "Authentication required. Please login first.",
      };
    }

    console.log("[ACTION] handleGetFeedbackById - Fetching feedback:", id);

    const response = await getFeedbackById(id);

    if (response.success) {
      return {
        success: true,
        message: "Feedback fetched successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to fetch feedback",
    };
  } catch (error: any) {
    console.error("[ACTION] handleGetFeedbackById error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch feedback",
    };
  }
};

/**
 * Admin: Fetch all feedback with optional filters
 * Pattern: UI → Action → API
 * Auth: Gets token from server-side cookies
 * Backend: GET /api/admin/feedback
 */
export const handleGetAdminFeedback = async (
  page: number = 1,
  size: number = 10,
  filters?: {
    status?: string;
    issueType?: string;
    priority?: string;
    sortBy?: string;
    sortOrder?: string;
  }
) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        message: "Authentication required. Please login first.",
      };
    }

    console.log("[ACTION] handleGetAdminFeedback - Fetching all feedback", {
      page,
      size,
      filters,
    });

    const response = await getAdminFeedback(page, size, filters);

    if (response.success) {
      return {
        success: true,
        message: "Feedback fetched successfully",
        data: response.data,
        metadata: response.metadata,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to fetch feedback",
      data: [],
    };
  } catch (error: any) {
    console.error("[ACTION] handleGetAdminFeedback error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch feedback",
      data: [],
    };
  }
};

/**
 * Admin: Fetch feedback statistics
 * Pattern: UI → Action → API
 * Auth: Gets token from server-side cookies
 * Backend: GET /api/admin/feedback/stats
 */
export const handleGetAdminFeedbackStats = async () => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        message: "Authentication required. Please login first.",
      };
    }

    console.log("[ACTION] handleGetAdminFeedbackStats - Fetching statistics");

    const response = await getAdminFeedbackStats();

    if (response.success) {
      return {
        success: true,
        message: "Statistics fetched successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to fetch statistics",
    };
  } catch (error: any) {
    console.error("[ACTION] handleGetAdminFeedbackStats error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch statistics",
    };
  }
};

/**
 * Admin: Update feedback status, priority, and resolution notes
 * Pattern: UI → Action → API
 * Auth: Gets token from server-side cookies
 * Backend: PATCH /api/admin/feedback/:id
 */
export const handleUpdateAdminFeedback = async (
  id: string,
  updates: {
    status?: string;
    priority?: string;
    resolutionNotes?: string;
  }
) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        message: "Authentication required. Please login first.",
      };
    }

    // Validate inputs
    if (!id) {
      return {
        success: false,
        message: "Feedback ID is required",
      };
    }

    if (!updates || Object.keys(updates).length === 0) {
      return {
        success: false,
        message: "At least one field is required to update",
      };
    }

    console.log("[ACTION] handleUpdateAdminFeedback - Updating feedback:", id, {
      updates,
    });

    const response = await updateAdminFeedback(id, updates);

    if (response.success) {
      return {
        success: true,
        message: response.message || "Feedback updated successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to update feedback",
    };
  } catch (error: any) {
    console.error("[ACTION] handleUpdateAdminFeedback error:", error);
    return {
      success: false,
      message: error.message || "Failed to update feedback",
    };
  }
};

/**
 * Admin: Delete feedback
 * Pattern: UI → Action → API
 * Auth: Gets token from server-side cookies
 * Backend: DELETE /api/admin/feedback/:id
 */
export const handleDeleteAdminFeedback = async (id: string) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        message: "Authentication required. Please login first.",
      };
    }

    // Validate input
    if (!id) {
      return {
        success: false,
        message: "Feedback ID is required",
      };
    }

    console.log("[ACTION] handleDeleteAdminFeedback - Deleting feedback:", id);

    const response = await deleteAdminFeedback(id);

    if (response.success) {
      return {
        success: true,
        message: response.message || "Feedback deleted successfully",
      };
    }

    return {
      success: false,
      message: response.message || "Failed to delete feedback",
    };
  } catch (error: any) {
    console.error("[ACTION] handleDeleteAdminFeedback error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete feedback",
    };
  }
};
