import axiosInstance from './axios';

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'application' | 'job' | 'system' | 'test';
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
}

/**
 * Get all notifications for the authenticated user with pagination
 * @param userId - The user ID to fetch notifications for
 * @param page - Page number (1-indexed)
 * @param size - Number of items per page
 */
export async function getNotifications(userId: string, page: number = 1, size: number = 5) {
  try {
    const response = await axiosInstance.get<any>(
      `/api/notifications/${userId}`,
      {
        params: {
          page,
          size,
        },
      }
    );

    console.log('[API] getNotifications response:', response.data);

    if (response.data.success) {
      return {
        success: true,
        notifications: response.data.data || [],
        total: response.data.total || 0,
        page: response.data.page || page,
        size: response.data.size || size,
        totalPages: response.data.totalPages || 0,
      };
    }

    return {
      success: false,
      error: 'Failed to fetch notifications',
      notifications: [],
      total: 0,
      page,
      size,
      totalPages: 0,
    };
  } catch (error: any) {
    console.error('[API] getNotifications error:', error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch notifications';
    return {
      success: false,
      error: errorMessage,
      notifications: [],
    };
  }
}

/**
 * Send a test notification to a user
 * @param userId - The user ID to send test notification to
 */
export async function sendTestNotification(userId: string) {
  try {
    const response = await axiosInstance.post<{
      success: boolean;
      message: string;
    }>(`/api/notifications/test/send/${userId}`);

    console.log('[API] sendTestNotification response:', response.data);

    return {
      success: response.data.success,
      message: response.data.message,
    };
  } catch (error: any) {
    console.error('[API] sendTestNotification error:', error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Failed to send test notification';
    return {
      success: false,
      error: errorMessage,
    };
  }
}
