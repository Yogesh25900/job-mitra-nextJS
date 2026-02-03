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
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import AdminSideBar from '../_components/AdminSideBar';
import EditModal from './_components/EditModal';
import CreateModal from './_components/CreateModal';
import { handleGetAllUsersAsAdmin, handleDeleteUserByIdAsAdmin } from '@/lib/actions/admin/admin-actions';
import { getUserAvatarUrl } from '@/lib/utils/imageUrl';

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

  // Authorization Check - Wait for loading to complete
  useEffect(() => {
    if (loading) return; // Wait until loading is complete
    
    if (!isAuthenticated || authUser?.role !== 'admin') {
      router.push('/login');
      return;
    }
  }, [loading, isAuthenticated, authUser, router]);

  // Fetch Users - Only fetch when authenticated and not loading
  useEffect(() => {
    const fetchUsers = async () => {
      // Wait for auth to be fully loaded before fetching
      if (loading || !isAuthenticated) return;

      try {
        setPageLoading(true);
        const response = await handleGetAllUsersAsAdmin(currentPage, ITEMS_PER_PAGE);
        console.log('Fetched users response:', response);

        if (response.success) {
          const formattedUsers = response.data.map((user: any) => {
            // Determine the display name based on role
            let displayName = 'N/A';
            if (user.role === 'employer') {
              displayName = user.companyName || user.contactName || 'N/A';
            } else {
              displayName = `${user.fname || ''} ${user.lname || ''}`.trim() || 'N/A';
            }

            // Determine the correct image path based on role
            const imagePath = user.role === 'employer' ? user.logoPath : user.profilePicturePath;

            return {
              _id: user._id,
              id: user._id,
              name: displayName,
              email: user.email || 'N/A',
              role: user.role || 'user',
              createdAt: user.createdAt || new Date().toISOString(),
              status: 'Active' as const,
              avatar: imagePath || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
              // Preserve original fields for details view
              companyName: user.companyName,
              contactName: user.contactName,
              phoneNumber: user.phoneNumber,
              fname: user.fname,
              lname: user.lname,
              profilePicturePath: user.profilePicturePath,
              logoPath: user.logoPath,
            };
          });
          setUsers(formattedUsers);
          
          // Set metadata from backend response
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
    };

    fetchUsers();
  }, [isAuthenticated, currentPage]);

  // Filtered and Paginated Users (client-side filtering only, pagination is server-side)
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const displayName = user.name || 'N/A';
      const matchesSearch =
        displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  // Use filtered users directly (no client-side pagination)
  const paginatedUsers = filteredUsers;

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
        setUsers((prev) => prev.filter((u) => u._id !== modal.user!._id));
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
  }, [modal.user, handleCloseModal]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleRoleFilterChange = useCallback((role: string) => {
    setRoleFilter(role);
    setCurrentPage(1);
  }, []);

  // Statistics
  const stats = useMemo(
    () => [
      {
        title: 'Total Users',
        value: users.length.toString(),
        subtitle: 'registered',
        icon: Users,
        color: 'blue' as const,
      },
      {
        title: 'Active Users',
        value: users.filter((u) => u.status === 'Active').length.toString(),
        subtitle: 'currently active',
        icon: CheckCircle2,
        color: 'emerald' as const,
      },
      {
        title: 'Pending',
        value: users.filter((u) => u.status === 'Pending').length.toString(),
        subtitle: 'action needed',
        icon: AlertCircle,
        color: 'amber' as const,
      },
    ],
    [users]
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="flex h-screen">
        {/* Sidebar Navigation */}
       <AdminSideBar />

        {/* Main Content */}
          <main className="ml-5 flex-1 p-8 overflow-auto">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-tight">
                User Management
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-base">
                Manage and oversee all platform participants across JobMitra.
              </p>
            </div>
            <button onClick={() => setCreateModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all hover:scale-[1.02]">
              <Plus className="w-5 h-5" />
              <span>Add New User</span>
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {stat.subtitle}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters and Search */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 mb-6 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg pl-12 pr-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <select
                  value={roleFilter}
                  onChange={(e) => handleRoleFilterChange(e.target.value)}
                  className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-purple-500 transition-colors cursor-pointer"
                >
                  <option>All</option>
                  <option>candidate</option>
                  <option>employer</option>
                  <option>admin</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="p-4 w-10">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 dark:border-slate-700 text-purple-600 focus:ring-purple-500 dark:bg-slate-800 cursor-pointer"
                      />
                    </th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      User Profile
                    </th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      User
                    </th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Role
                    </th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Status
                    </th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Last Active
                    </th>
                    <th className="p-4 w-10">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {pageLoading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center">
                        <Loader className="w-6 h-6 text-blue-500 animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center">
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                          No users found matching your filters.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user) => (
                        <tr
                          key={user._id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="p-4">
                            <input type="checkbox" className="rounded border-slate-300 dark:border-slate-700 text-purple-600 focus:ring-purple-500 dark:bg-slate-800 cursor-pointer" />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-slate-700 flex-shrink-0">
                                <img
                                  src={getUserAvatarUrl(user.profilePicturePath, user.avatar, user.email)}
                                  alt={user.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;
                                  }}
                                />
                              </div>
                              
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="text-slate-900 dark:text-white font-semibold text-sm">
                                {user.name}
                              </span>
                              <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                                {user.email}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                              <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                                {user.status}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-slate-500 dark:text-slate-400 text-sm">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleOpenModal('view', user)} 
                                className="text-green-500 hover:text-green-700 p-1"
                                title="View User"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  setEditingUserId(user._id);
                                  setEditModalOpen(true);
                                }}
                                className="text-blue-500 hover:text-blue-700 p-1"
                                title="Edit User"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleOpenModal('delete', user)} 
                                disabled={deleting === user._id} 
                                className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50"
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
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Showing{' '}
                <span className="text-slate-900 dark:text-white font-bold">
                  {metadata.total === 0 ? 0 : (metadata.page - 1) * metadata.size + 1}
                </span> to{' '}
                <span className="text-slate-900 dark:text-white font-bold">
                  {Math.min(metadata.page * metadata.size, metadata.total)}
                </span> of{' '}
                <span className="text-slate-900 dark:text-white font-bold">
                  {metadata.total}
                </span>{' '}
                entries
              </p>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-purple-500 hover:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                          ? 'bg-purple-500 text-white'
                          : 'border border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {metadata.totalPages > 5 && currentPage < metadata.totalPages - 2 && (
                  <>
                    <span className="text-slate-400 px-1">...</span>
                    <button 
                      onClick={() => setCurrentPage(metadata.totalPages)}
                      className="w-10 h-10 rounded-lg border border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-bold"
                    >
                      {metadata.totalPages}
                    </button>
                  </>
                )}
                
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(metadata.totalPages, prev + 1))}
                  disabled={currentPage === metadata.totalPages}
                  className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-purple-500 hover:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* View User Modal */}
      {modal.type === 'view' && modal.user && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                User Details
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Profile Picture */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <img
                  src={getUserAvatarUrl(modal.user.profilePicturePath, modal.user.avatar, modal.user.email)}
                  alt={modal.user.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">{modal.user.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">ID: {modal.user._id.slice(-8)}</p>
                </div>
              </div>

              {/* User Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Email</label>
                  <p className="text-slate-900 dark:text-white">{modal.user.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Role</label>
                  <p className="text-slate-900 dark:text-white capitalize">{modal.user.role}</p>
                </div>

                {modal.user.role === 'employer' && (
                  <>
                    <div>
                      <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Company Name</label>
                      <p className="text-slate-900 dark:text-white">{modal.user.companyName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Contact Name</label>
                      <p className="text-slate-900 dark:text-white">{modal.user.contactName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Phone Number</label>
                      <p className="text-slate-900 dark:text-white">{modal.user.phoneNumber || 'N/A'}</p>
                    </div>
                  </>
                )}

                {modal.user.role === 'candidate' && (
                  <>
                    <div>
                      <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">First Name</label>
                      <p className="text-slate-900 dark:text-white">{modal.user.fname || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Last Name</label>
                      <p className="text-slate-900 dark:text-white">{modal.user.lname || 'N/A'}</p>
                    </div>
                  </>
                )}
                
                <div>
                  <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Status</label>
                  <p className="text-slate-900 dark:text-white">{modal.user.status}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Created At</label>
                  <p className="text-slate-900 dark:text-white">
                    {modal.user.createdAt ? new Date(modal.user.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Updated At</label>
                  <p className="text-slate-900 dark:text-white">
                    {modal.user.updatedAt ? new Date(modal.user.updatedAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Link 
                  href={`/admin/users/${modal.user._id}/edit`}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center"
                >
                  Edit User
                </Link>
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
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
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Delete User
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Are you sure you want to delete <strong>{modal.user.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={!!deleting}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            // Refresh users list with proper pagination and formatting
            try {
              const response = await handleGetAllUsersAsAdmin(currentPage, ITEMS_PER_PAGE);
              if (response.success) {
                const formattedUsers = response.data.map((user: any) => {
                  // Determine the display name based on role
                  let displayName = 'N/A';
                  if (user.role === 'employer') {
                    displayName = user.companyName || user.contactName || 'N/A';
                  } else {
                    displayName = `${user.fname || ''} ${user.lname || ''}`.trim() || 'N/A';
                  }

                  // Determine the correct image path based on role
                  const imagePath = user.role === 'employer' ? user.logoPath : user.profilePicturePath;

                  return {
                    _id: user._id,
                    id: user._id,
                    name: displayName,
                    email: user.email || 'N/A',
                    role: user.role || 'user',
                    createdAt: user.createdAt || new Date().toISOString(),
                    status: 'Active' as const,
                    avatar: imagePath || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
                    // Preserve original fields for details view
                    companyName: user.companyName,
                    contactName: user.contactName,
                    phoneNumber: user.phoneNumber,
                    fname: user.fname,
                    lname: user.lname,
                    profilePicturePath: user.profilePicturePath,
                    logoPath: user.logoPath,
                  };
                });
                setUsers(formattedUsers);
                
                if (response.metadata) {
                  setMetadata(response.metadata);
                }
              }
            } catch (error) {
              console.error('Error refreshing users:', error);
            }
          }}
        />
      )}

      {/* Create User Modal */}
      {createModalOpen && (
        <CreateModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSuccess={async () => {
            // Refresh users list with proper pagination and formatting
            try {
              const response = await handleGetAllUsersAsAdmin(currentPage, ITEMS_PER_PAGE);
              if (response.success) {
                const formattedUsers = response.data.map((user: any) => {
                  // Determine the display name based on role
                  let displayName = 'N/A';
                  if (user.role === 'employer') {
                    displayName = user.companyName || user.contactName || 'N/A';
                  } else {
                    displayName = `${user.fname || ''} ${user.lname || ''}`.trim() || 'N/A';
                  }

                  // Determine the correct image path based on role
                  const imagePath = user.role === 'employer' ? user.logoPath : user.profilePicturePath;

                  return {
                    _id: user._id,
                    id: user._id,
                    name: displayName,
                    email: user.email || 'N/A',
                    role: user.role || 'user',
                    createdAt: user.createdAt || new Date().toISOString(),
                    status: 'Active' as const,
                    avatar: imagePath || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
                    // Preserve original fields for details view
                    companyName: user.companyName,
                    contactName: user.contactName,
                    phoneNumber: user.phoneNumber,
                    fname: user.fname,
                    lname: user.lname,
                    profilePicturePath: user.profilePicturePath,
                    logoPath: user.logoPath,
                  };
                });
                setUsers(formattedUsers);
                
                if (response.metadata) {
                  setMetadata(response.metadata);
                }
              }
            } catch (error) {
              console.error('Error refreshing users:', error);
            }
          }}
        />
      )}
    </div>
  );
}