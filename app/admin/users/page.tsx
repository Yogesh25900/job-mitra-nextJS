'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Eye,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader,
  X,
  MoreVertical,
  Plus,
  UserPlus,
  Briefcase,
  UserCheck,
  Building2,
  Shield,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import EditModal from './_components/EditModal';
import CreateModal from './_components/CreateModal';
import { getUserAvatarUrl } from '@/lib/utils/imageUrl';
import { handleDeleteUserByIdAsAdmin, handleGetAllUsersAsAdmin, handleGetDashboardStatsAsAdmin } from '@/lib/actions/admin/admin-actions';

interface User {
  _id: string;
  id?: string;
  name?: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
  status?: 'Active' | 'Pending' | 'Suspended';
  avatar?: string;
  profilePicturePath?: string;
  logoPath?: string;
  location?: string;
  // Employer fields
  companyName?: string;
  contactName?: string;
  phoneNumber?: string;
  // Candidate fields
  fname?: string;
  lname?: string;
}

interface ModalState {
  type: 'view' | 'delete' | 'edit' | null;
  user: User | null;
}

const ITEMS_PER_PAGE = 5;

interface AdminDashboardCounts {
  totalUsers: number;
  talentCount: number;
  employerCount: number;
}

export default function UserManagement() {
  const router = useRouter();
  const { user: authUser, isAuthenticated, loading } = useAuth();

  // State Management
  const [users, setUsers] = useState<User[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState<ModalState>({ type: null, user: null });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [metadata, setMetadata] = useState({ total: 0, page: 1, size: ITEMS_PER_PAGE, totalPages: 0 });
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [dashboardCounts, setDashboardCounts] = useState<AdminDashboardCounts>({
    totalUsers: 0,
    talentCount: 0,
    employerCount: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const formatUsers = useCallback((rawUsers: any[]) => {
    return rawUsers.map((user: any) => {
      let displayName = 'not set';
      if (user.role === 'employer') {
        displayName = user.companyName || user.contactName || 'not set';
      } else if (user.role === 'candidate') {
        displayName = `${user.fname || ''} ${user.lname || ''}`.trim() || 'not set';
      } else {
        displayName = user.fname || 'not set';
      }

      const imagePath = user.role === 'employer' ? user.logoPath : user.profilePicturePath;

      return {
        _id: user._id,
        id: user._id,
        name: displayName,
        email: user.email || 'not set',
        role: user.role || 'user',
        createdAt: user.createdAt || new Date().toISOString(),
        status: 'Active' as const,
        avatar: imagePath || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        location: user.location || 'not set',
        companyName: user.companyName,
        contactName: user.contactName,
        phoneNumber: user.phoneNumber,
        fname: user.fname,
        lname: user.lname,
        profilePicturePath: user.profilePicturePath,
        logoPath: user.logoPath,
      };
    });
  }, []);

  const refreshUsers = useCallback(async () => {
    if (loading || !isAuthenticated) return;

    try {
      setPageLoading(true);
      const response = await handleGetAllUsersAsAdmin(
        currentPage,
        ITEMS_PER_PAGE,
        debouncedSearchTerm,
        roleFilter
      );
      console.log('Fetched users response:', response);

      if (response.success) {
        setUsers(formatUsers(response.data || []));
        if (response.metadata) {
          setMetadata(response.metadata);
        }
      } else {
        toast.error(response.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users');
    } finally {
      setPageLoading(false);
    }
  }, [
    loading,
    isAuthenticated,
    currentPage,
    debouncedSearchTerm,
    roleFilter,
    formatUsers,
  ]);

  const refreshDashboardCounts = useCallback(async () => {
    if (loading || !isAuthenticated) return;

    try {
      const statsResponse = await handleGetDashboardStatsAsAdmin();
      if (statsResponse.success && statsResponse.data) {
        setDashboardCounts({
          totalUsers: Number(statsResponse.data.totalUsers || 0),
          talentCount: Number(statsResponse.data.talentCount || 0),
          employerCount: Number(statsResponse.data.employerCount || 0),
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard counts:', error);
    }
  }, [loading, isAuthenticated]);

  // Authorization Check - Wait for loading to complete
  useEffect(() => {
    if (loading) return; // Wait until loading is complete
    
    if (!isAuthenticated || authUser?.role !== 'admin') {
      router.push('/login');
      return;
    }
  }, [loading, isAuthenticated, authUser, router]);

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  useEffect(() => {
    refreshDashboardCounts();
  }, [refreshDashboardCounts]);

  // Backend already returns paginated/filtered users
  const paginatedUsers = users;

  // Handlers
  const handleOpenModal = useCallback((type: 'view' | 'delete', user: User) => {
    setModal({ type, user });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModal({ type: null, user: null });
  }, []);

  const handleDeleteUser = useCallback(async () => {
    if (!modal.user) return;

    try {
      setDeleting(modal.user._id);
      const response = await handleDeleteUserByIdAsAdmin(modal.user._id);

      if (response.success) {
        await refreshUsers();
        await refreshDashboardCounts();
        handleCloseModal();
        toast.success('User deleted successfully');
      } else {
        toast.error(response.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
    } finally {
      setDeleting(null);
    }
  }, [modal.user, handleCloseModal, refreshUsers, refreshDashboardCounts]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleRoleFilterChange = useCallback((role: string) => {
    setRoleFilter(role);
    setCurrentPage(1);
  }, []);

  // Export to CSV
  const handleExportCSV = useCallback(async () => {
    try {
      // Fetch all users with current filters
      const response = await handleGetAllUsersAsAdmin(
        1,
        999, // Fetch a large number to get all users
        debouncedSearchTerm,
        roleFilter
      );

      if (!response.success || !response.data) {
        toast.error('Failed to export users');
        return;
      }

      const usersToExport = response.data;

      // Prepare CSV data
      const headers = ['Name', 'Email', 'Role', 'Location', 'Phone Number', 'Created Date'];
      const rows = usersToExport.map((user: any) => [
        user.companyName ? user.companyName : `${user.fname || ''} ${user.lname || ''}`.trim(),
        user.email,
        user.role,
        user.location || 'not set',
        user.phoneNumber || 'unset',
        user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US') : 'not set',
      ]);

      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map((row: any[]) => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Users exported successfully');
    } catch (error) {
      console.error('Error exporting users:', error);
      toast.error('Error exporting users');
    }
  }, [debouncedSearchTerm, roleFilter]);

  // Statistics
  const stats = useMemo(
    () => [
      {
        title: 'Total Users',
        value: dashboardCounts.totalUsers.toString(),
        subtitle: 'registered',
        icon: Users,
        color: 'blue' as const,
      },
      {
        title: 'Candidates',
        value: dashboardCounts.talentCount.toString(),
        subtitle: 'registered candidates',
        icon: UserCheck,
        color: 'emerald' as const,
      },
      {
        title: 'Employer Users',
        value: dashboardCounts.employerCount.toString(),
        subtitle: 'registered employers',
        icon: Briefcase,
        color: 'amber' as const,
      },
    ],
    [dashboardCounts]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || authUser?.role !== 'admin') {
    return null; // Redirect is handled by useEffect
  }

  return (
    <div className="min-h-full bg-white dark:bg-slate-950 transition-colors duration-200">
          <main className="p-8 overflow-auto">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-tight">
                User Management
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Monitor activity, manage roles, and update platform permissions.
              </p>
            </div>
            <button onClick={() => setCreateModalOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors shadow-md">
              <UserPlus className="w-5 h-5" />
              <span>Add New User</span>
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 hover:border-gray-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                      {stat.title}
                    </p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                    <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-2 flex items-center gap-1">
                      <span>+</span> +12.5% vs last month
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    {stat.icon === Users && <Users className="w-7 h-7 text-blue-600 dark:text-blue-400" />}
                    {stat.icon === UserCheck && <UserCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />}
                    {stat.icon === Briefcase && <Building2 className="w-7 h-7 text-amber-600 dark:text-amber-400" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

     

          {/* Tabs and Actions */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative flex-1 min-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              />
            </div>
            <div className="flex gap-2">
              {['All', 'Employers', 'Candidates'].map((tab) => {
                const isActive = roleFilter === (tab === 'All' ? 'All' : tab === 'Candidates' ? 'candidate' : 'employer');
                let bgColor = 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700';
                
                if (isActive) {
                  if (tab === 'All') bgColor = 'bg-blue-600 hover:bg-blue-700 text-white';
                  else if (tab === 'Candidates') bgColor = 'bg-emerald-600 hover:bg-emerald-700 text-white';
                  else bgColor = 'bg-amber-600 hover:bg-amber-700 text-white';
                } else {
                  if (tab === 'Candidates') bgColor = 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30';
                  else if (tab === 'Employers') bgColor = 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30';
                }
                
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      if (tab === 'All') {
                        handleRoleFilterChange('All');
                      } else if (tab === 'Candidates') {
                        handleRoleFilterChange('candidate');
                      } else {
                        handleRoleFilterChange('employer');
                      }
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${bgColor}`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium whitespace-nowrap border border-blue-200 dark:border-slate-700"
            >
              <span>↓</span>
              Export CSV
            </button>
          </div>

          {/* Data Table */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-800">
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-400">
                      User Profile
                    </th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-400">
                      Location
                    </th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-400">
                      Role
                    </th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-400">
                      Phone Number
                    </th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-400">
                      Created
                    </th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                  {pageLoading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center">
                        <Loader className="w-6 h-6 text-violet-500 animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center">
                        <p className="text-gray-600 dark:text-slate-400 text-sm">
                          No users found matching your filters.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user) => (
                        <tr
                          key={user._id}
                          className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors border-b border-gray-200 dark:border-slate-800"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-300 dark:bg-slate-700 flex-shrink-0">
                                <img
                                  src={getUserAvatarUrl(user.logoPath || user.profilePicturePath, undefined, user.email, user.role === 'employer' ? 'logo' : 'profile')}
                                  alt={user.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;
                                  }}
                                />
                              </div>
                              <div>
                                <p className="text-gray-900 dark:text-white font-semibold text-sm">{user.name}</p>
                                <p className="text-gray-600 dark:text-slate-400 text-xs">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-gray-700 dark:text-slate-300 text-sm font-medium">
                              {user.location}
                            </span>
                          </td>
                          <td className="p-4">
                            {user.role === 'candidate' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                <UserCheck className="w-3.5 h-3.5" />
                                Candidate
                              </span>
                            )}
                            {user.role === 'employer' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                                <Building2 className="w-3.5 h-3.5" />
                                Employer
                              </span>
                            )}
                            {user.role === 'admin' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                                <Shield className="w-3.5 h-3.5" />
                                Admin
                              </span>
                            )}
                            {!['candidate', 'employer', 'admin'].includes(user.role) && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300">
                                <User className="w-3.5 h-3.5" />
                                {user.role}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="text-gray-700 dark:text-slate-300 text-sm font-medium">
                              {user.phoneNumber || 'not set'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-gray-600 dark:text-slate-400 text-sm">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'not set'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => {
                                  setEditingUserId(user._id);
                                  setEditModalOpen(true);
                                }}
                                className="text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors p-1"
                                title="Edit User"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleOpenModal('delete', user)} 
                                disabled={deleting === user._id} 
                                className="text-gray-400 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1 disabled:opacity-50"
                                title="Delete User"
                              >
                                {deleting === user._id ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <p className="text-gray-600 dark:text-slate-400 text-sm font-medium">
                Showing{' '}
                <span className="text-gray-900 dark:text-white font-bold">
                  {metadata.total === 0 ? 0 : (metadata.page - 1) * metadata.size + 1}
                </span> to{' '}
                <span className="text-gray-900 dark:text-white font-bold">
                  {Math.min(metadata.page * metadata.size, metadata.total)}
                </span> of{' '}
                <span className="text-gray-900 dark:text-white font-bold">
                  {metadata.total}
                </span>{' '}
                entries
              </p>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-700 text-slate-400 hover:text-violet-400 hover:border-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {/* Dynamic page numbers */}
                {Array.from({ length: Math.min(5, metadata.totalPages) }, (_, i) => {
                  let pageNum;
                  if (metadata.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= metadata.totalPages - 2) {
                    pageNum = metadata.totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                        pageNum === currentPage
                          ? 'bg-violet-600 text-white'
                          : 'border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {metadata.totalPages > 5 && currentPage < metadata.totalPages - 2 && (
                  <>
                    <span className="text-slate-600 px-1">...</span>
                    <button 
                      onClick={() => setCurrentPage(metadata.totalPages)}
                      className="w-10 h-10 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 text-sm font-bold"
                    >
                      {metadata.totalPages}
                    </button>
                  </>
                )}
                
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(metadata.totalPages, prev + 1))}
                  disabled={currentPage === metadata.totalPages}
                  className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-700 text-slate-400 hover:text-violet-400 hover:border-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </main>
      
      {/* View User Modal */}
      {modal.type === 'view' && modal.user && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                User Details
              </h3>
              <button onClick={handleCloseModal} className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Profile Picture */}
              <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
                <img
                  src={getUserAvatarUrl(modal.user.logoPath || modal.user.profilePicturePath, modal.user.avatar, modal.user.email, modal.user.role === 'employer' ? 'logo' : 'profile')}
                  alt={modal.user.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">{modal.user.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-slate-400">ID: {modal.user._id.slice(-8)}</p>
                </div>
              </div>

              {/* User Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-400">Email</label>
                  <p className="text-white">{modal.user.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-slate-400">Role</label>
                  <p className="text-white capitalize">{modal.user.role}</p>
                </div>

                {modal.user.role === 'employer' && (
                  <>
                    <div>
                      <label className="text-sm font-semibold text-slate-400">Company Name</label>
                      <p className="text-white">{modal.user.companyName || 'not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-400">Contact Name</label>
                      <p className="text-white">{modal.user.contactName || 'not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-400">Phone Number</label>
                      <p className="text-white">{modal.user.phoneNumber || 'not set'}</p>
                    </div>
                  </>
                )}

                {modal.user.role === 'candidate' && (
                  <>
                    <div>
                      <label className="text-sm font-semibold text-slate-400">First Name</label>
                      <p className="text-white">{modal.user.fname || 'not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-400">Last Name</label>
                      <p className="text-white">{modal.user.lname || 'not set'}</p>
                    </div>
                  </>
                )}
                
                <div>
                  <label className="text-sm font-semibold text-slate-400">Status</label>
                  <p className="text-white">{modal.user.status}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-slate-400">Created At</label>
                  <p className="text-white">
                    {modal.user.createdAt ? new Date(modal.user.createdAt).toLocaleString() : 'not set'}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-400">Updated At</label>
                  <p className="text-white">
                    {modal.user.updatedAt ? new Date(modal.user.updatedAt).toLocaleString() : 'not set'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <Link 
                  href={`/admin/users/${modal.user._id}/edit`}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg transition-colors text-center font-medium"
                >
                  Edit User
                </Link>
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {modal.type === 'delete' && modal.user && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Delete User
            </h3>
            <p className="text-gray-600 dark:text-slate-400 mb-6">
              Are you sure you want to delete <strong className="text-gray-900 dark:text-white">{modal.user.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={!!deleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editModalOpen && editingUserId && (
        <EditModal
          userId={editingUserId}
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingUserId(null);
          }}
          onSuccess={async () => {
            await refreshUsers();
            await refreshDashboardCounts();
          }}
        />
      )}

      {/* Create User Modal */}
      {createModalOpen && (
        <CreateModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSuccess={async () => {
            await refreshUsers();
            await refreshDashboardCounts();
          }}
        />
      )}
    </div>
  );
}