'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, BarChart3, DollarSign, FileText, LogOut, Settings, Users, Briefcase, TrendingUp, Search, Bell, HelpCircle, MoreVertical } from 'lucide-react';
import AdminSideBar from './_components/AdminSideBar';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { user: authUser, isAuthenticated, loading } = useAuth();
  const [shouldRender, setShouldRender] = useState(false);

  // Protect admin route - only check AFTER loading is complete
  useEffect(() => {
    console.log('[ADMIN PAGE] useEffect - loading:', loading, 'isAuthenticated:', isAuthenticated, 'authUser:', authUser);
    
    if (loading) {
      console.log('[ADMIN PAGE] Still loading auth, waiting...');
      return;
    }
    
    console.log('[ADMIN PAGE] Auth loading complete. Checking permissions...');
    console.log('[ADMIN PAGE] isAuthenticated:', isAuthenticated);
    console.log('[ADMIN PAGE] authUser?.role:', authUser?.role);
    
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
    
    console.log('[ADMIN PAGE] User is admin, allowing render');
    setShouldRender(true);
  }, [loading, isAuthenticated, authUser, router]);

  // Show loading state while checking auth
  if (loading || !shouldRender) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const metrics = [
    {
      title: 'Total Users',
      value: '12,450',
      change: '+12%',
      period: 'from last month',
      icon: Users,
      color: 'primary',
      trend: 'up'
    },
    {
      title: 'Active Jobs',
      value: '1,204',
      change: '+5%',
      period: 'from last week',
      icon: Briefcase,
      color: 'indigo',
      trend: 'up'
    },
    {
      title: 'Total Revenue',
      value: '$45,200',
      change: '+8%',
      period: 'past 30 days',
      icon: DollarSign,
      color: 'emerald',
      trend: 'up'
    },
    {
      title: 'New Applications',
      value: '856',
      change: '+15%',
      period: 'last 24h',
      icon: FileText,
      color: 'amber',
      trend: 'up'
    }
  ];

  const activities = [
    {
      title: 'New Talent Joined',
      description: 'Sarah Miller registered as UI/UX Designer',
      time: '2 mins ago',
      icon: Users,
      color: 'primary'
    },
    {
      title: 'Job Posted',
      description: 'TechCorp Inc. posted "Senior React Dev"',
      time: '15 mins ago',
      icon: Activity,
      color: 'indigo'
    },
    {
      title: 'Verification Success',
      description: 'Global Solutions passed KYC verification',
      time: '1 hour ago',
      icon: Activity,
      color: 'emerald'
    },
    {
      title: 'Reported Content',
      description: 'Job #342 reported for suspicious activity',
      time: '3 hours ago',
      icon: Activity,
      color: 'red'
    }
  ];

  const users = [
    {
      name: 'Emily Blunt',
      email: 'emily.b@example.com',
      role: 'Freelancer',
      roleColor: 'blue',
      joinedDate: 'Oct 24, 2023',
      status: 'Active',
      statusColor: 'emerald',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiG-LL1uMtDackv481Ev4E4hVRDLuIFJWUij7PJv2dAQkRdGuYyyn5dQWy3oRehEaz1_SwF2TaoY-I-tv32Fwq4sdsqyeNRL1hdnhp5Sq-VFuxqynIFtTEh-ka3RiundB6WzmUDsDeKI1c_62S98WRuY0Gr3kiDuAkBoy2QQA-EDsWdzkPg8NK7hRibf4ncgSsxupQ5EhZDMu6KFpdaLqAxVIaJuty9aCoNoCSjySaNUdnS0prlrikAYz69b1_Qa7kEczhopvi2Qnk'
    },
    {
      name: 'Marcus Thorne',
      email: 'marcus@techstack.io',
      role: 'Employer',
      roleColor: 'purple',
      joinedDate: 'Oct 23, 2023',
      status: 'Active',
      statusColor: 'emerald',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXk8iZSSfUsytiIt_-0CuyN8oh8KOTLdb4ZTSRDQLife8RAE7WdNkKSld4G7LS5tSW2e5E81sBUIb80cYShgF3BF9xAuBvRxLPeSF0Ws7nX2F4exwT3eexMUXs-Wn9A50vmSicPpQSim74ALdTMcUomrB6lYd3gvDr8xspG5mt5pPxV69PPTfXKTsArEF3efzS5Q0jUon_7UulR5UBtPhFf3Q4kRQLqRcz8VXDjqDkvhixUFVGxfe2Dw0Jhlm3XVQEOKUo7NFfq92q'
    },
    {
      name: 'James Wilson',
      email: 'james.w@designly.com',
      role: 'Freelancer',
      roleColor: 'blue',
      joinedDate: 'Oct 23, 2023',
      status: 'Pending',
      statusColor: 'amber',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALJcA68LCTWMAZ0nDuda5lP1YkO3rKAzPpIQk7VKhXpqYSHP74KQX14sVribFRe2TlG_pKdg-dzXoEM6Vhtd7VLjjxGEKPP1o85_EZoFOtM5LIvMQU1fXmqrinVG_3FE62kHl-NuFR63WodRZoDVvSwYO-966Fh5u3eZirAHz67itgGonz_cWfxYXsDEfcm1eJBKVafPti9lMC5uPVsBzqsj4-cKn4kjSQt41R9bpremm2RFccfBCWw2vHyfvN9GU03S7vNd9qAgct'
    }
  ];

  const chartBars = [60, 45, 75, 65, 90, 85];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-950">
        {/* Sidebar */}
        <AdminSideBar />
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search analytics, users, or jobs..."
                className="w-full bg-gray-100 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-600 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <button className="p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="h-8 w-px bg-gray-200 dark:border-slate-800 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{authUser?.email || 'Admin User'}</p>
                <p className="text-xs text-gray-500 dark:text-blue-300">{authUser?.role || 'Admin'}</p>
              </div>
              <div className="h-10 w-10 rounded-full border border-gray-300 dark:border-slate-700 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                {authUser?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
            <p className="text-gray-500 dark:text-blue-300 mt-1">Welcome back, Alex. Here's what's happening with JobMitra today.</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              const colorClasses = {
                primary: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
                emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
                amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
              };

              return (
                <div key={index} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 rounded-xl flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-blue-300">{metric.title}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{metric.value}</p>
                    </div>
                    <div className={`${colorClasses[metric.color as keyof typeof colorClasses]} p-2 rounded-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" /> {metric.change}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500 text-xs">{metric.period}</span>
                  </div>
                  <div className="h-16 w-full mt-auto bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-lg"></div>
                </div>
              );
            })}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Chart */}
            <div className="xl:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Job Posting Trends</h3>
                <select className="bg-white dark:bg-slate-800 border-none text-xs font-semibold rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-blue-600 dark:text-white">
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                </select>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-8 h-96 flex flex-col">
                <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-2">
                  {chartBars.map((height, index) => (
                    <div key={index} className="flex flex-col items-center flex-1 gap-2">
                      <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-t-lg relative h-48 overflow-hidden">
                        <div className={`absolute bottom-0 left-0 right-0 bg-blue-600/40 dark:bg-blue-600/40 rounded-t-lg transition-all hover:bg-blue-600 dark:hover:bg-blue-500`} style={{ height: `${height}%` }}></div>
                      </div>
                      <span className="text-xs font-medium text-gray-400">{months[index]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="xl:col-span-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activities</h3>
                <button className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline">View All</button>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="divide-y divide-gray-100 dark:divide-slate-800">
                  {activities.map((activity, index) => {
                    const Icon = activity.icon;
                    const colorClasses = {
                      primary: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                      indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
                      emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
                      red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    };

                    return (
                      <div key={index} className="p-4 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                        <div className={`${colorClasses[activity.color as keyof typeof colorClasses]} h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{activity.title}</p>
                          <p className="text-xs text-gray-500 dark:text-blue-300">{activity.description}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">New User Registrations</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-800 text-xs font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  Export CSV
                </button>
                <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors">
                  Add New User
                </button>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-blue-300 text-[11px] uppercase tracking-wider font-bold border-b border-gray-200 dark:border-slate-800">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {users.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-8 w-8 rounded-full border border-gray-200 dark:border-slate-800"
                          />
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-blue-300">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2 py-1 bg-${user.roleColor}-100 dark:bg-${user.roleColor}-900/30 text-${user.roleColor}-600 dark:text-${user.roleColor}-400 rounded-lg`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{user.joinedDate}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-${user.statusColor}-100 dark:bg-${user.statusColor}-900/30 text-${user.statusColor}-600 dark:text-${user.statusColor}-400`}>
                          <span className={`w-1.5 h-1.5 rounded-full bg-${user.statusColor}-500`}></span>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto p-8 border-t border-gray-200 dark:border-slate-800 text-center">
          <p className="text-xs text-gray-400 dark:text-blue-300">© 2023 JobMitra Platform. All rights reserved. Version 2.4.0-build.88</p>
        </footer>
      </main>
    </div>
  );
}