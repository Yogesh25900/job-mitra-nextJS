'use server';

import { getNotifications, sendTestNotification } from '@/lib/api/notifications';
import { getAuthToken, getUserData } from '@/lib/cookie';

/**
 * Server action to fetch notifications for the current user with pagination
 */
export async function handleGetNotifications(page: number = 1, size: number = 5) {
  try {
    const token = await getAuthToken();
    const userData = await getUserData();

    if (!token || !userData) {
      return {
        success: false,
        error: 'Authentication required. Please log in again.',
        notifications: [],
        total: 0,
        page,
        size,
        totalPages: 0,
      };
    }

    const userId = userData.id || userData._id;

    if (!userId) {
      return {
        success: false,
        error: 'User ID not found. Please log in again.',
        notifications: [],
        total: 0,
        page,
        size,
        totalPages: 0,
      };
    }

    const result = await getNotifications(userId, page, size);
    return result;
  } catch (error) {
    console.error('[Server Action] handleGetNotifications error:', error);
    return {
      success: false,
      error: 'Failed to fetch notifications',
      notifications: [],
      total: 0,
      page,
      size,
      totalPages: 0,
    };
  }
}

/**
 * Server action to send a test notification
 */
export async function handleSendTestNotification() {
  try {
    const token = await getAuthToken();
    const userData = await getUserData();

    if (!token || !userData) {
      return {
        success: false,
        error: 'Authentication required. Please log in again.',
      };
    }

    const userId = userData.id || userData._id;

    if (!userId) {
      return {
        success: false,
        error: 'User ID not found. Please log in again.',
      };
    }

    const result = await sendTestNotification(userId);
    return result;
  } catch (error) {
    console.error('[Server Action] handleSendTestNotification error:', error);
    return {
      success: false,
      error: 'Failed to send test notification',
    };
  }
}
