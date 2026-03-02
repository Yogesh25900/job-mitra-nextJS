'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, BarChart3, DollarSign, FileText, LogOut, Settings, Users, Briefcase, TrendingUp, Search, Bell, HelpCircle, MoreVertical } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getDashboardStats, getJobPostingTrends, getRecentActivities } from '@/lib/api/admin/admin';
import { formatTimeAgo } from '@/lib/utils/timeFormat';

interface DashboardStats {
  totalUsers: number;
  activeJobs: number;
  totalApplications: number;
  talentCount: number;
  employerCount: number;
}

interface JobTrend {
  _id: string;
  count: number;
  categoryName: string;
}

interface Activity {
  _id: string;
  title: string;
  description: string;
  type: string;
  time: string;
  icon: string;
  color: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { user: authUser, isAuthenticated, loading, token } = useAuth();
  const [shouldRender, setShouldRender] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trends, setTrends] = useState<JobTrend[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Protect admin route - only check AFTER loading is complete
  useEffect(() => {
    console.log('[ADMIN PAGE] useEffect 1 triggered - loading:', loading, 'isAuthenticated:', isAuthenticated, 'authUser:', authUser);
    
    if (loading) {
      console.log('[ADMIN PAGE] Still loading auth, waiting...');
      return;
    }
    
    console.log('[ADMIN PAGE] Auth loading complete. Checking permissions...');
    console.log('[ADMIN PAGE] isAuthenticated:', isAuthenticated);
    console.log('[ADMIN PAGE] authUser?.role:', authUser?.role);
    console.log('[ADMIN PAGE] token available:', !!token);
    
    // Only allow if authenticated as admin
    if (!isAuthenticated) {
      console.log('[ADMIN PAGE] Not authenticated, redirecting to /admin/login');
      router.push('/admin/login');
      return;
    }
    
    if (!authUser || authUser.role !== 'admin') {
      console.log('[ADMIN PAGE] Not an admin user. Role:', authUser?.role);
      console.log('[ADMIN PAGE] Redirecting to /admin/login');
      router.push('/admin/login');
      return;
    }
    
    console.log('[ADMIN PAGE] User is admin, allowing render. Setting shouldRender to true');
    setShouldRender(true);
  }, [loading, isAuthenticated, authUser, router]);

  // Fetch dashboard data function (moved outside useEffect for reusability)
  const fetchDashboardData = React.useCallback(async () => {
    if (!token) {
      console.error('[Dashboard] No token available');
      setError('Authentication token not found. Please log in again.');
      return;
    }

    try {
      setLoadingData(true);
      setError(null);

      console.log('[Dashboard] Starting data fetch with token:', token?.slice(0, 10) + '...');

      // Fetch stats, trends, and activities in parallel
      // Request more activities (50) to show historical data
      const [statsRes, trendsRes, activitiesRes] = await Promise.all([
        getDashboardStats(token).catch(err => {
          console.error('[Dashboard] Stats fetch error:', err);
          return { success: false, data: null };
        }),
        getJobPostingTrends(token).catch(err => {
          console.error('[Dashboard] Trends fetch error:', err);
          return { success: false, data: [] };
        }),
        getRecentActivities(token, 50, 0).catch(err => {
          console.error('[Dashboard] Activities fetch error:', err);
          return { success: false, data: [] };
        }),
      ]);

      console.log('[Dashboard] Response data:', { statsRes, trendsRes, activitiesRes });

      if (statsRes?.success && statsRes?.data) {
        console.log('[Dashboard] Setting stats:', statsRes.data);
        setStats(statsRes.data);
      } else {
        console.warn('[Dashboard] Stats response failed:', statsRes);
      }
      
      if (trendsRes?.success) {
        console.log('[Dashboard] Setting trends:', trendsRes.data);
        setTrends(trendsRes.data || []);
      } else {
        console.warn('[Dashboard] Trends response failed:', trendsRes);
      }
      
      if (activitiesRes?.success) {
        console.log('[Dashboard] Setting activities:', activitiesRes.data?.length);
        setActivities(activitiesRes.data || []);
      } else {
        console.warn('[Dashboard] Activities response failed:', activitiesRes);
      }
    } catch (err: any) {
      console.error('[Dashboard] Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoadingData(false);
    }
  }, [token]);

  // Fetch dashboard data when user is authenticated
  useEffect(() => {
    if (shouldRender && token) {
      console.log('[Dashboard] Conditions met, calling fetchDashboardData');
      fetchDashboardData();
    }
  }, [shouldRender, token, fetchDashboardData]);

  // Show loading state while checking auth
  if (loading || !shouldRender) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  const metrics = [
    {
      title: 'Total Users',
      value: stats?.totalUsers?.toLocaleString() || '0',
      subtext: `${stats?.talentCount || 0} talents, ${stats?.employerCount || 0} employers`,
      change: '+12%',
      period: 'from last month',
      icon: Users,
      color: 'primary',
      trend: 'up'
    },
    {
      title: 'Active Jobs',
      value: stats?.activeJobs?.toLocaleString() || '0',
      change: '+5%',
      period: 'from last week',
      icon: Briefcase,
      color: 'indigo',
      trend: 'up'
    },
    {
      title: 'New Applications',
      value: stats?.totalApplications?.toLocaleString() || '0',
      change: '+15%',
      period: 'last 24h',
      icon: FileText,
      color: 'amber',
      trend: 'up'
    }
  ];

  // Calculate trend data for bar chart
  const chartData = trends.slice(0, 6).map(trend => ({
    name: trend.categoryName,
    count: trend.count,
  }));
  
  // Pad with empty data if less than 6 categories
  while (chartData.length < 6) {
    chartData.push({ name: '', count: 0 });
  }

  const chartBars = chartData.map(data => {
    // Normalize bar heights (0-100)
    const maxCount = Math.max(...chartData.map(d => d.count)) || 1;
    return (data.count / maxCount) * 100;
  });

  return (
      <main className="flex flex-col min-h-full bg-white dark:bg-slate-950 transition-colors duration-200">
     

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
            
            <p className="text-gray-600 dark:text-slate-400 mt-1">Welcome back, {authUser?.email?.split('@')[0] || 'Admin'}. Here's what's happening with JobMitra today.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200 font-semibold">Error Loading Dashboard</p>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
              <button 
                onClick={() => fetchDashboardData()}
                className="mt-2 text-red-600 dark:text-red-400 text-sm font-bold hover:underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              const colorClasses = {
                primary: 'bg-blue-900/30 text-blue-400',
                indigo: 'bg-indigo-900/30 text-indigo-400',
                emerald: 'bg-emerald-900/30 text-emerald-400',
                amber: 'bg-amber-900/30 text-amber-400'
              };

              return (
                <div key={index} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 rounded-xl flex flex-col transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-slate-400">{metric.title}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {loadingData ? (
                          <span className="inline-block animate-pulse">••••</span>
                        ) : (
                          metric.value
                        )}
                      </p>
                      {metric.subtext && !loadingData && <p className="text-xs text-gray-600 dark:text-slate-500 mt-1">{metric.subtext}</p>}
                    </div>
                    <div className={`${colorClasses[metric.color as keyof typeof colorClasses]} p-2 rounded-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" /> {metric.change}
                    </span>
                    <span className="text-gray-600 dark:text-slate-500 text-xs">{metric.period}</span>
                  </div>
                  <div className="h-16 w-full mt-auto bg-gradient-to-b from-blue-200/20 dark:from-blue-900/20 to-transparent rounded-lg"></div>
                </div>
              );
            })}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Chart */}
            <div className="xl:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Job Posting Trends by Category</h3>
                <select className="bg-gray-200 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-xs font-semibold rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-primary text-gray-900 dark:text-white">
                  <option>Current Year</option>
                  <option>Last Year</option>
                </select>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-8 h-96 flex flex-col">
                {loadingData ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-600"></div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-2">
                    {chartBars.map((height, index) => (
                      <div key={index} className="flex flex-col items-center flex-1 gap-2">
                        <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-t-lg relative h-48 overflow-hidden">
                          <div className={`absolute bottom-0 left-0 right-0 bg-blue-600/40 rounded-t-lg transition-all hover:bg-blue-500`} style={{ height: `${Math.max(height || 0, 5)}%` }}></div>
                        </div>
                        <span className="text-xs font-medium text-gray-600 dark:text-slate-400 text-center truncate w-full px-1">{chartData[index].name || `Cat ${index + 1}`}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="xl:col-span-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activities</h3>
                <button className="text-primary dark:text-blue-400 text-xs font-bold hover:underline">View All</button>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="divide-y divide-gray-200 dark:divide-slate-800 max-h-96 overflow-y-auto">
                  {loadingData ? (
                    <div className="p-4 flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-violet-600"></div>
                    </div>
                  ) : activities.length === 0 ? (
                    <div className="p-4 text-center text-slate-500">
                      No activities found
                    </div>
                  ) : (
                    activities.length > 0 && activities.map((activity) => {
                      const colorClasses = {
                        primary: 'bg-blue-900/30 text-blue-400',
                        indigo: 'bg-indigo-900/30 text-indigo-400',
                        emerald: 'bg-emerald-900/30 text-emerald-400',
                        amber: 'bg-amber-900/30 text-amber-400',
                        red: 'bg-red-900/30 text-red-400'
                      };

                      const getIcon = (type: string) => {
                        switch(type) {
                          case 'job_posted': return Briefcase;
                          case 'talent_joined': return Users;
                          case 'application_submitted': return FileText;
                          case 'user_verified': return Activity;
                          case 'content_reported': return Activity;
                          case 'job': return Briefcase;
                          case 'application': return FileText;
                          default: return Activity;
                        }
                      }

                      const Icon = getIcon(activity.type);

                      return (
                        <div key={activity._id} className="p-4 flex items-start gap-4 hover:bg-gray-100 dark:hover:bg-slate-800/30 transition-colors">
                          <div className={`${colorClasses[activity.color as keyof typeof colorClasses]} h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{activity.title}</p>
                            <p className="text-xs text-gray-600 dark:text-slate-400 line-clamp-2">{activity.description}</p>
                            <p className="text-[10px] text-gray-600 dark:text-slate-500 mt-1">{formatTimeAgo(new Date(activity.time))}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto p-8 border-t border-gray-200 dark:border-slate-800 text-center">
          <p className="text-xs text-gray-600 dark:text-slate-400">© 2024 JobMitra Platform. All rights reserved. Version 2.4.0-build.88</p>
        </footer>
      </main>
  );
}