

import { getAuthToken } from "../cookie";
import axiosInstance from "./axios";
import { API } from "./endpoints";

// User submits feedback
export const submitFeedback = async (formData: FormData) => {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        message: 'Authentication token not found. Please log in again.'
      };
    }

    const response = await axiosInstance.post(API.FEEDBACK.CREATE, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error submitting feedback:', error?.response?.data || error?.message);
    return {
      success: false,
      message: error?.response?.data?.message || 'Failed to submit feedback',
    };
  }
};

// Get user's own feedback
export const getUserFeedback = async (page: number = 1, size: number = 10) => {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        message: 'Authentication token not found. Please log in again.'
      };
    }

    const response = await axiosInstance.get(API.FEEDBACK.GET_MY_FEEDBACK, {
      params: {
        page,
        size,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user feedback:', error?.response?.data || error?.message);
    return {
      success: false,
      message: error?.response?.data?.message || 'Failed to fetch feedback',
      data: []
    };
  }
};

// Get feedback by ID
export const getFeedbackById = async (id: string) => {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        message: 'Authentication token not found. Please log in again.'
      };
    }

    const response = await axiosInstance.get(API.FEEDBACK.GET_BY_ID(id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching feedback:', error?.response?.data || error?.message);
    return {
      success: false,
      message: error?.response?.data?.message || 'Failed to fetch feedback',
    };
  }
};

// Admin - Get all feedback with filters
export const getAdminFeedback = async (page: number = 1, size: number = 10, filters?: {
  status?: string;
  issueType?: string;
  priority?: string;
  sortBy?: string;
  sortOrder?: string;
}) => {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        message: 'Authentication token not found. Please log in again.'
      };
    }

    const response = await axiosInstance.get(API.FEEDBACK.ADMIN.GETALL, {
      params: {
        page,
        size,
        ...filters,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching feedback:', error?.response?.data || error?.message);
    return {
      success: false,
      message: error?.response?.data?.message || 'Failed to fetch feedback',
      data: []
    };
  }
};

// Admin - Get feedback statistics
export const getAdminFeedbackStats = async () => {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        message: 'Authentication token not found. Please log in again.'
      };
    }

    const response = await axiosInstance.get(API.FEEDBACK.ADMIN.STATS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching feedback statistics:', error?.response?.data || error?.message);
    return {
      success: false,
      message: error?.response?.data?.message || 'Failed to fetch feedback statistics',
      data: {}
    };
  }
};

// Admin - Update feedback
export const updateAdminFeedback = async (id: string, updates: {
  status?: string;
  priority?: string;
  resolutionNotes?: string;
}) => {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        message: 'Authentication token not found. Please log in again.'
      };
    }

    const response = await axiosInstance.patch(API.FEEDBACK.ADMIN.UPDATE(id), updates, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error updating feedback:', error?.response?.data || error?.message);
    return {
      success: false,
      message: error?.response?.data?.message || 'Failed to update feedback',
    };
  }
};

// Admin - Delete feedback
export const deleteAdminFeedback = async (id: string) => {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        message: 'Authentication token not found. Please log in again.'
      };
    }

    const response = await axiosInstance.delete(API.FEEDBACK.ADMIN.DELETE(id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error deleting feedback:', error?.response?.data || error?.message);
    return {
      success: false,
      message: error?.response?.data?.message || 'Failed to delete feedback',
    };
  }
};
