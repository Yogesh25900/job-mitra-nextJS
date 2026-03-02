'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader,
  X,
  Plus,
  Briefcase,
  View,
  EyeIcon,
  TrendingUp,
  XCircle,
  Clock,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import ViewJobModal from './_components/ViewJobModal';

import { handleDeleteJobByIdAsAdmin, handleGetAllJobsAsAdmin, handleGetJobStatsAsAdmin } from '@/lib/actions/admin/admin-actions';
import EditJobModal from './_components/EditJobModal';
import CreateJobModal from './_components/CreateJobModal';

interface Job {
  _id: string;
  jobTitle: string;
  companyName: string;
  jobLocation: string;
  jobType: string;
  experienceLevel: string;
  jobCategory: string;
  jobDescription: string;
  applicationDeadline: string;
  responsibilities: string[];
  qualifications: string[];
  tags: string[];
  companyProfilePicPath: string;
  status: string;
  employerId: any;
  createdAt: string;
  updatedAt: string;
  applicationCount?: number;
}

interface ModalState {
  type: 'view' | 'delete' | null;
  job: Job | null;
}

const ITEMS_PER_PAGE = 5;

interface AdminJobCounts {
  totalJobs: number;
  activeJobs: number;
  inactiveJobs: number;
}

export default function JobManagement() {
  const router = useRouter();
  const { user: authUser, isAuthenticated, loading } = useAuth();

  // State Management
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState<ModalState>({ type: null, job: null });
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingJobId, setViewingJobId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [metadata, setMetadata] = useState({ total: 0, page: 1, size: ITEMS_PER_PAGE, totalPages: 0 });
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [jobCounts, setJobCounts] = useState<AdminJobCounts>({
    totalJobs: 0,
    activeJobs: 0,
    inactiveJobs: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
      // Reset to first page when search term changes
      setCurrentPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Helper function to get display status
  const getDisplayStatus = (status: string): string => {
    if (status === 'Active' || status === 'Inactive') {
      return status;
    }
    return 'Unknown';
  };

  // Helper function to get status badge styling
  const getStatusBadgeClass = (status: string): string => {
    const displayStatus = getDisplayStatus(status);
    if (displayStatus === 'Active') {
      return 'bg-green-500/20 text-green-300';
    } else if (displayStatus === 'Inactive') {
      return 'bg-red-500/20 text-red-300';
    } else {
      return 'bg-slate-500/20 text-slate-300';
    }
  };

  const refreshJobs = useCallback(async () => {
    if (loading || !isAuthenticated) return;

    try {
      setPageLoading(true);
      
      // Fetch jobs with status filter
      const response = await handleGetAllJobsAsAdmin(
        currentPage,
        ITEMS_PER_PAGE,
        debouncedSearchTerm,
        statusFilter
      );
      console.log('🔵 [Admin Job Management] Fetched jobs:', response);
      if (response.success) {
        setJobs(response.data || []);
        if (response.metadata) {
          setMetadata(response.metadata);
        }
      } else {
        toast.error(response.message || 'Failed to fetch jobs');
      }
      
      // Fetch stats from backend (only when on first page or when refreshing)
      if (currentPage === 1) {
        const statsResponse = await handleGetJobStatsAsAdmin();
        
        if (statsResponse.success && statsResponse.data) {
          setJobCounts({
            totalJobs: statsResponse.data.totalJobs,
            activeJobs: statsResponse.data.activeJobs,
            inactiveJobs: statsResponse.data.inactiveJobs,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Error fetching jobs');
    } finally {
      setPageLoading(false);
    }
  }, [loading, isAuthenticated, currentPage, debouncedSearchTerm, statusFilter]);

  // Authorization Check - Wait for loading to complete
  useEffect(() => {
    if (loading) return;
    
    if (!isAuthenticated || authUser?.role !== 'admin') {
      router.push('/login');
      return;
    }
  }, [loading, isAuthenticated, authUser, router]);

  useEffect(() => {
    refreshJobs();
  }, [refreshJobs]);

  // Handlers
  const handleOpenModal = useCallback((type: 'view' | 'delete', job: Job) => {
    setModal({ type, job });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModal({ type: null, job: null });
  }, []);

  const handleDeleteJob = useCallback(async () => {
    if (!modal.job) return;

    try {
      setDeleting(modal.job._id);
      const response = await handleDeleteJobByIdAsAdmin(modal.job._id);

      if (response.success) {
        await refreshJobs();
        handleCloseModal();
        toast.success('Job deleted successfully');
      } else {
        toast.error(response.message || 'Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Error deleting job');
    } finally {
      setDeleting(null);
    }
  }, [modal.job, handleCloseModal, refreshJobs]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleStatusFilterChange = useCallback((status: 'All' | 'Active' | 'Inactive') => {
    setStatusFilter(status);
    setCurrentPage(1);
  }, []);

  // Export to CSV
  const handleExportCSV = useCallback(async () => {
    try {
      const response = await handleGetAllJobsAsAdmin(1, 999, debouncedSearchTerm, statusFilter);

      if (!response.success || !response.data) {
        toast.error('Failed to export jobs');
        return;
      }

      const jobsToExport = response.data;
      const headers = ['Job Title', 'Company Name', 'Location', 'Type', 'Status', 'Experience Level', 'Posted Date'];
      const rows = jobsToExport.map((job: Job) => [
        job.jobTitle,
        job.companyName,
        job.jobLocation,
        job.jobType,
        getDisplayStatus(job.status),
        job.experienceLevel,
        job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-US') : 'not set',
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map((row: any[]) => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `jobs_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Jobs exported successfully');
    } catch (error) {
      console.error('Error exporting jobs:', error);
      toast.error('Error exporting jobs');
    }
  }, [debouncedSearchTerm]);

  // Statistics
  const stats = useMemo(
    () => [
      {
        title: 'Total Jobs',
        value: jobCounts.totalJobs.toString(),
        subtitle: 'posted',
        icon: Briefcase,
        color: 'blue' as const,
      },
      {
        title: 'Active Jobs',
        value: jobCounts.activeJobs.toString(),
        subtitle: 'currently active',
        icon: CheckCircle2,
        color: 'emerald' as const,
      },
      {
        title: 'Inactive Jobs',
        value: jobCounts.inactiveJobs.toString(),
        subtitle: 'archived',
        icon: AlertCircle,
        color: 'amber' as const,
      },
    ],
    [jobCounts]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || authUser?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-full bg-white dark:bg-slate-950 transition-colors duration-200">
        <main className="p-8 overflow-auto">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-tight">
                Job Management
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Monitor all job postings, manage status, and oversee employer activities.
              </p>
            </div>
            <button onClick={() => setCreateModalOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors shadow-md">
              <Plus className="w-5 h-5" />
              <span>Post New Job</span>
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
                    {stat.icon === Briefcase && <Briefcase className="w-7 h-7 text-blue-600 dark:text-blue-400" />}
                    {stat.icon === CheckCircle2 && <TrendingUp className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />}
                    {stat.icon === AlertCircle && <Clock className="w-7 h-7 text-amber-600 dark:text-amber-400" />}
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
                placeholder="Search by job title, company, location..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              />
            </div>
            <div className="flex gap-2">
              {['All', 'Active', 'Inactive'].map((tab) => {
                const isActive = statusFilter === tab;
                let bgColor = 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700';
                
                if (isActive) {
                  if (tab === 'All') bgColor = 'bg-blue-600 hover:bg-blue-700 text-white';
                  else if (tab === 'Active') bgColor = 'bg-emerald-600 hover:bg-emerald-700 text-white';
                  else bgColor = 'bg-red-600 hover:bg-red-700 text-white';
                } else {
                  if (tab === 'Active') bgColor = 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30';
                  else if (tab === 'Inactive') bgColor = 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30';
                }
                
                return (
                  <button
                    key={tab}
                    onClick={() => handleStatusFilterChange(tab as 'All' | 'Active' | 'Inactive')}
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
                      Job Title
                    </th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-400">
                      Company
                    </th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-400">
                      Location
                    </th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-400">
                      Type
                    </th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-400">
                      Status
                    </th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-400">
                      Posted
                    </th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                  {pageLoading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center">
                        <Loader className="w-6 h-6 text-violet-500 animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : jobs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center">
                        <p className="text-gray-600 dark:text-slate-400 text-sm">
                          No jobs found matching your filters.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    jobs.map((job) => (
                      <tr
                        key={job._id}
                        className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors border-b border-gray-200 dark:border-slate-800"
                      >
                        <td className="p-4">
                          <span className="text-gray-900 dark:text-white font-semibold text-sm">{job.jobTitle}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-700 dark:text-slate-300 text-sm">{job.companyName || 'N/A'}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-700 dark:text-slate-300 text-sm">{job.jobLocation}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-700 dark:text-slate-300 text-sm">{job.jobType}</span>
                        </td>
                        <td className="p-4">
                          {getDisplayStatus(job.status) === 'Active' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Active
                            </span>
                          )}
                          {getDisplayStatus(job.status) === 'Inactive' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
                              <XCircle className="w-3.5 h-3.5" />
                              Inactive
                            </span>
                          )}
                          {!['Active', 'Inactive'].includes(getDisplayStatus(job.status)) && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300">
                              <AlertCircle className="w-3.5 h-3.5" />
                              {getDisplayStatus(job.status)}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="text-gray-600 dark:text-slate-400 text-sm">
                            {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => {
                                setViewingJobId(job._id);
                                setViewModalOpen(true);
                              }}
                              className="text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors p-1"
                              title="View Job"
                            >
                             <EyeIcon className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setEditingJobId(job._id);
                                setEditModalOpen(true);
                              }}
                              className="text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors p-1"
                              title="Edit Job"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleOpenModal('delete', job)} 
                              disabled={deleting === job._id} 
                              className="text-gray-400 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1 disabled:opacity-50"
                              title="Delete Job"
                            >
                              {deleting === job._id ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
                  className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
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
                          : 'border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:border-gray-400 dark:hover:border-slate-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {metadata.totalPages > 5 && currentPage < metadata.totalPages - 2 && (
                  <>
                    <span className="text-gray-400 dark:text-slate-600 px-1">...</span>
                    <button 
                      onClick={() => setCurrentPage(metadata.totalPages)}
                      className="w-10 h-10 rounded-lg border border-gray-300 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:border-gray-400 dark:hover:border-slate-600 text-sm font-bold"
                    >
                      {metadata.totalPages}
                    </button>
                  </>
                )}
                
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(metadata.totalPages, prev + 1))}
                  disabled={currentPage === metadata.totalPages}
                  className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </main>

      {/* Delete Confirmation Modal */}
      {modal.type === 'delete' && modal.job && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Delete Job
            </h3>
            <p className="text-gray-600 dark:text-slate-400 mb-6">
              Are you sure you want to delete <strong className="text-gray-900 dark:text-white">{modal.job.jobTitle}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteJob}
                disabled={!!deleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
            <button
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
      )}

      {/* View Job Modal */}
      {viewModalOpen && viewingJobId && (
        <ViewJobModal
          jobId={viewingJobId}
          isOpen={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setViewingJobId(null);
          }}
        />
      )}

      {/* Edit Job Modal */}
      {editModalOpen && editingJobId && (
        <EditJobModal
          jobId={editingJobId}
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingJobId(null);
          }}
          onSuccess={async () => {
            await refreshJobs();
          }}
        />
      )}

      {/* Create Job Modal */}
      {createModalOpen && (
        <CreateJobModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSuccess={async () => {
            await refreshJobs();
          }}
        />
      )}
    </div>
  );
}
