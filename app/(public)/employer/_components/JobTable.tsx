'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import JobTableRow from './JobTableRow'
import { deleteJob, getEmployerJobs } from '@/lib/api/job'
import { Loader, Search } from 'lucide-react'
import toast from 'react-hot-toast'

interface Job {
  _id?: string;
  id?: string;
  jobTitle: string;
  title: string;
  companyName?: string;
  department: string;
  jobType?: string;
  type: string;
  status: 'Live' | 'Draft' | 'Closed';
  applicants?: number;
  applicationCount?: number;
  newApplicants?: number;
  createdAt?: string;
  datePosted: string;
}

export default function JobTable() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalJobs, setTotalJobs] = useState(0)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [jobToDelete, setJobToDelete] = useState<{ id: string; title: string } | null>(null)
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const PAGE_SIZE = 5

  useEffect(() => {
    fetchJobs(1, searchQuery)
  }, [])

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1)
      fetchJobs(1, searchQuery)
    }, 500)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  const fetchJobs = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true)
    
      const response = await getEmployerJobs(page, PAGE_SIZE, search || undefined)

      if (response.success && response.data) {
        // Map API response to Job interface
        const mappedJobs = Array.isArray(response.data)
          ? response.data.map((job: any) => ({
              id: job._id || job.id,
              _id: job._id,
              title: job.jobTitle || job.title || 'Untitled Job',
              jobTitle: job.jobTitle || job.title || 'Untitled Job',
              department: job.jobCategory?.name || job.department || 'General',
              type: job.jobType || job.type || 'Full-time',
              status: (job.status === 'Active' ? 'Live' : job.status === 'Inactive' ? 'Closed' : 'Draft') as 'Live' | 'Draft' | 'Closed',
              applicants: job.applicationCount || job.applicants || 0,
              datePosted: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A',
            }))
          : []

        setJobs(mappedJobs)
        setCurrentPage(response.page || page)
        setTotalPages(response.totalPages || 1)
        setTotalJobs(response.total || 0)
      } else {
        console.error('Failed to fetch jobs:', response.message)
        setJobs([])
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewApplicants = (jobId: string, jobTitle: string) => {
    router.push(`/employer/jobs/applicants?jobId=${jobId}&jobTitle=${encodeURIComponent(jobTitle)}`)
  }

  const handleEditJob = (jobId: string) => {
    router.push(`/employer/jobs/edit/${jobId}`)
  }

  const handleDeleteJob = (jobId: string, jobTitle: string) => {
    if (!jobId) {
      toast.error('Job id is missing')
      return
    }

    setJobToDelete({ id: jobId, title: jobTitle })
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!jobToDelete?.id) {
      toast.error('Job id is missing')
      return
    }

    setDeletingJobId(jobToDelete.id)

    try {
      const response = await deleteJob(jobToDelete.id)
      if (response.success) {
        toast.success(response.message || 'Job deleted')
        // Refresh the list
        fetchJobs(currentPage, searchQuery)
      } else {
        toast.error(response.message || 'Failed to delete job')
      }
    } catch (error) {
      toast.error('Failed to delete job')
    } finally {
      setDeletingJobId(null)
      setShowDeleteModal(false)
      setJobToDelete(null)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchJobs(currentPage - 1, searchQuery)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchJobs(currentPage + 1, searchQuery)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header with Title and Stats */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight mb-3">
          Job Postings
        </h2>
        {totalJobs > 0 && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing {jobs.length} of {totalJobs} jobs • Page {currentPage} of {totalPages}
          </p>
        )}
      </div>

      {/* Search Bar and Add Job Button */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs by title, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#cfdbe7] dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-white"
            />
          </div>
        </div>
        <button
          onClick={() => router.push('/employer/add-job')}
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Job
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#cfdbe7] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="animate-spin text-blue-600 mr-3" size={24} />
            <span className="text-slate-600 dark:text-slate-400">Loading jobs...</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-slate-600 dark:text-slate-400">No jobs found</p>
              <p className="text-xs text-slate-500 mt-2">Post your first job to get started</p>
            </div>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-[#cfdbe7] dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#4c739a]">
                  Job Title
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#4c739a]">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#4c739a]">
                  Applicants
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#4c739a]">
                  Date Posted
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#4c739a]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cfdbe7] dark:divide-slate-800">
              {jobs.filter(job => job.title && job.department && job.type).map((job) => (
                <JobTableRow
                  key={job._id || job.id}
                  title={job.title || 'Untitled'}
                  department={job.department || 'General'}
                  type={job.type || 'Full-time'}
                  status={job.status}
                  applicants={job.applicants || 0}
                  newApplicants={job.newApplicants}
                  datePosted={job.datePosted || 'N/A'}
                  onView={() => handleViewApplicants(job._id || job.id || '', job.title || 'Untitled')}
                  onEdit={() => handleEditJob(job._id || job.id || '')}
                  onDelete={() => handleDeleteJob(job._id || job.id || '', job.title || 'Untitled')}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-white border border-[#cfdbe7] dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Page <span className="font-semibold text-slate-900 dark:text-white">{currentPage}</span> of <span className="font-semibold text-slate-900 dark:text-white">{totalPages}</span>
          </div>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-white border border-[#cfdbe7] dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-8 max-w-sm w-full text-center mx-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Job Posting?</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Are you sure you want to delete
              {jobToDelete?.title ? (
                <span className="font-semibold text-red-600 dark:text-red-400"> {jobToDelete.title} </span>
              ) : (
                ' this job '
              )}
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                className="px-5 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                onClick={() => {
                  setShowDeleteModal(false)
                  setJobToDelete(null)
                }}
                disabled={!!deletingJobId}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                onClick={handleConfirmDelete}
                disabled={!!deletingJobId}
              >
                {deletingJobId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}