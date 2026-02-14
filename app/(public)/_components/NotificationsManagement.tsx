'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, AlertCircle, Loader2, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  handleGetNotifications,
  handleSendTestNotification,
} from '@/lib/actions/notifications-actions';
import { getUserData } from '@/lib/cookie';
import type { Notification } from '@/lib/api/notifications';

interface NotificationsState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  isRefreshing: boolean;
  showTestButton: boolean;
  currentPage: number;
  totalPages: number;
  totalNotifications: number;
}

export default function NotificationsManagement() {
  const [state, setState] = useState<NotificationsState>({
    notifications: [],
    isLoading: true,
    error: null,
    isRefreshing: false,
    showTestButton: true,
    currentPage: 1,
    totalPages: 0,
    totalNotifications: 0,
  });

  const NOTIFICATIONS_PER_PAGE = 5;

  const socketRef = useRef<any>(null);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Initialize notifications and Socket.IO
    initializeNotifications();

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const initializeNotifications = async () => {
    // Fetch initial notifications
    await fetchNotifications(1);

    // Get user ID for Socket.IO
    const userData = await getUserData();
    const userId = userData?.id || userData?._id;

    if (userId) {
      userIdRef.current = userId;
      // Initialize Socket.IO for real-time updates
      initializeSocket(userId);
    }
  };

  const initializeSocket = (userId: string) => {
    try {
      // Dynamically import Socket.IO client
      const { io } = require('socket.io-client');
      
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      
      // Connect to backend
      const socket = io(backendUrl, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      socketRef.current = socket;

        // Register user with their userId to receive notifications
        socket.on('connect', () => {
          console.log('✅ Socket.IO Connected');
          // Register this socket with the user's ID
          socket.emit('register', userId);
          console.log('📝 Registered with userId:', userId);
        });

      // Listen for incoming notifications
      socket.on('notification', (notification: any) => {
        console.log('📢 [Socket.IO] New notification received:', notification);
        
        // Show toast for new notification
        if (notification.title) {
          toast.success(`${notification.title}: ${notification.message}`, {
            duration: 5,
            icon: '🔔',
          });
        }

        // Add notification to list at the top
        setState((prev) => ({
          ...prev,
          notifications: [notification, ...prev.notifications],
        }));
      });

      socket.on('disconnect', () => {
        console.log('❌ Socket.IO Disconnected');
      });

      socket.on('error', (error: any) => {
        console.error('⚠️ Socket.IO Error:', error);
      });
    } catch (error) {
      // Socket.IO not available, will use manual refresh instead
      console.log('ℹ️ Socket.IO not available, will use manual refresh');
    }
  };

  const fetchNotifications = async (page: number = 1) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const result = await handleGetNotifications(page, NOTIFICATIONS_PER_PAGE);

    if (result.success) {
      // Sort by createdAt descending (newest first)
      const sortedNotifications = (result.notifications || []).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setState((prev) => ({
        ...prev,
        notifications: sortedNotifications,
        isLoading: false,
        currentPage: result.page || page,
        totalPages: result.totalPages || 1,
        totalNotifications: result.total || 0,
      }));
    } else {
      const errorMsg = result.error || 'Failed to fetch notifications';
      setState((prev) => ({
        ...prev,
        error: errorMsg,
        isLoading: false,
        notifications: [],
      }));
      toast.error(errorMsg);
    }
  };

  const handleRefresh = async () => {
    setState((prev) => ({ ...prev, isRefreshing: true }));
    await fetchNotifications(state.currentPage);
    setState((prev) => ({ ...prev, isRefreshing: false }));
    toast.success('Notifications refreshed');
  };

  const handlePreviousPage = () => {
    if (state.currentPage > 1) {
      fetchNotifications(state.currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (state.currentPage < state.totalPages) {
      fetchNotifications(state.currentPage + 1);
    }
  };

  const handleSendTest = async () => {
    setState((prev) => ({ ...prev, showTestButton: false }));

    const result = await handleSendTestNotification();

    if (result.success) {
      toast.success('Test notification sent! 🔔');
      // Auto-refresh after a short delay to fetch the new notification
      setTimeout(() => {
        fetchNotifications();
      }, 1500);
    } else {
      toast.error(result.error || 'Failed to send test notification');
    }

    setState((prev) => ({ ...prev, showTestButton: true }));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'application':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'job':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'system':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'test':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const unreadCount = state.notifications.filter((n) => !n.isRead).length;

  // Loading State
  if (state.isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Notifications
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base mt-1">
              Stay updated with your job search activities
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center py-16 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">
              Loading notifications...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (state.error && !state.isRefreshing) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Notifications
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base mt-1">
              Stay updated with important updates and activities
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <div className="text-center">
            <p className="text-slate-900 dark:text-white font-medium mb-2">
              Error loading notifications
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
              {state.error}
            </p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (state.notifications.length === 0) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Notifications
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base mt-1">
              Stay updated with important updates and activities
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600" />
          <div className="text-center">
            <p className="text-slate-900 dark:text-white font-medium mb-2">
              No notifications yet
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              You're all caught up! We'll notify you when something important happens.
            </p>
            {state.showTestButton && (
              <button
                onClick={handleSendTest}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Send className="w-4 h-4" />
                Send Test Notification
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Notifications List
  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary text-white">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base mt-1">
            Stay updated with important updates and activities
            {state.totalPages > 0 && (
              <span className="block text-sm mt-1">
                Page {state.currentPage} of {state.totalPages} • {state.totalNotifications} total
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleRefresh}
          disabled={state.isRefreshing}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
        >
          {state.isRefreshing ? (
            <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
          ) : null}
          Refresh
        </button>
        {state.showTestButton && (
          <button
            onClick={handleSendTest}
            className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Test Notification
          </button>
        )}
      </div>

      {/* Notifications Table - Desktop View */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                Message
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {state.notifications.map((notification, index) => (
              <tr
                key={`${notification._id}-${index}`}
                className={`border-b border-slate-200 dark:border-slate-700 transition-colors ${
                  index % 2 === 0
                    ? 'bg-white dark:bg-slate-800'
                    : 'bg-slate-50 dark:bg-slate-900/50'
                } hover:bg-slate-100 dark:hover:bg-slate-700`}
              >
                <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    )}
                    {notification.title}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 max-w-md truncate">
                  {notification.message}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(
                      notification.type
                    )}`}
                  >
                    {getTypeLabel(notification.type)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                  {formatDate(notification.createdAt)}
                </td>
                <td className="px-6 py-4 text-sm">
                  {notification.isRead ? (
                    <span className="text-slate-500 dark:text-slate-400 text-xs">
                      Read
                    </span>
                  ) : (
                    <span className="text-primary font-semibold text-xs">
                      Unread
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notifications List - Mobile View */}
      <div className="md:hidden flex flex-col gap-3">
        {state.notifications.map((notification, index) => (
          <div
            key={`${notification._id}-${index}`}
            className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {!notification.isRead && (
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  )}
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {notification.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  {notification.message}
                </p>
                <div className="flex items-center gap-3 text-xs">
                  <span
                    className={`px-2.5 py-1 rounded-full font-semibold ${getTypeColor(
                      notification.type
                    )}`}
                  >
                    {getTypeLabel(notification.type)}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {formatDate(notification.createdAt)}
                  </span>
                  {!notification.isRead && (
                    <span className="text-primary font-semibold">Unread</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {state.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8 pb-4">
          <button
            onClick={handlePreviousPage}
            disabled={state.currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Page <span className="font-semibold text-slate-900 dark:text-white">{state.currentPage}</span> of <span className="font-semibold text-slate-900 dark:text-white">{state.totalPages}</span>
          </div>
          <button
            onClick={handleNextPage}
            disabled={state.currentPage === state.totalPages}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}

      {/* Info Message */}
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>✨ Real-time Updates:</strong> Notifications are connected via Socket.IO. New notifications will appear instantly as they arrive. You can also use the Refresh button to manually check for updates.
        </p>
      </div>
    </div>
  );
}
