"use client"

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Eye, Trash2, Download } from 'lucide-react'
import { handleGetMyApplications, handleDeleteJobApplication } from '@/lib/actions/application-management-actions'
import ViewApplicationModal from './ViewApplicationModal'
import type { JobApplication } from '@/lib/types/application'
import DeleteConfirmationModal from './DeleteConfirmationModal'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export default function ApplicationsManagement() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [applicationToDelete, setApplicationToDelete] = useState<JobApplication | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalApplications, setTotalApplications] = useState(0)
  const PAGE_SIZE = 5

  // Fetch applications on mount
  useEffect(() => {
    fetchApplications(currentPage)
  }, [])

  const fetchApplications = async (page: number = 1) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await handleGetMyApplications(page, PAGE_SIZE)
      console.log('Fetched applications response:', response)

      if (response.success && response.data) {
        setApplications(Array.isArray(response.data) ? response.data : [])
        setCurrentPage(response.page || page)
        setTotalPages(response.totalPages || 1)
        setTotalApplications(response.total || 0)
      } else {
        setError(response.message || 'Failed to fetch applications')
        setApplications([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setApplications([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewApplication = (app: JobApplication) => {
    setSelectedApplication(app)
    setShowViewModal(true)
  }

  const handleDeleteClick = (app: JobApplication) => {
    setApplicationToDelete(app)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!applicationToDelete) return

    try {
      setIsDeleting(true)
      const response = await handleDeleteJobApplication(applicationToDelete._id)

      if (response.success) {
        toast.success('Application deleted successfully')
        // Remove from list
        const updatedApplications = applications.filter(app => app._id !== applicationToDelete._id)
        setApplications(updatedApplications)
        setTotalApplications(totalApplications - 1)
        // If current page is now empty and not the first page, go to previous page
        if (updatedApplications.length === 0 && currentPage > 1) {
          fetchApplications(currentPage - 1)
        } else if (updatedApplications.length === 0) {
          setTotalPages(0)
        }
        setShowDeleteModal(false)
        setApplicationToDelete(null)
      } else {
        toast.error(response.message || 'Failed to delete application')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setIsDeleting(false)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchApplications(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchApplications(currentPage + 1)
    }
  }

  const handleDownloadResume = (resumePath?: string) => {
    if (!resumePath) {
      toast.error('Resume not available')
      return
    }
    const resumeUrl = `${BACKEND_URL}/profile_pictures/${resumePath}`
    window.open(resumeUrl, '_blank')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Shortlisted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Reviewing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'Pending':
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Helper function to get job title
  const getJobTitle = (app: JobApplication) => {
    if (typeof app.jobId === 'object' && app.jobId?.jobTitle) {
      return app.jobId.jobTitle
    }
    return 'N/A'
  }

  // Helper function to get company name
  const getCompanyName = (app: JobApplication) => {
    if (typeof app.jobId === 'object' && app.jobId?.companyName) {
      return app.jobId.companyName
    }
    return 'N/A'
  }

  // Helper function to get location
  const getLocation = (app: JobApplication) => {
    if (typeof app.jobId === 'object' && app.jobId?.jobLocation) {
      return app.jobId.jobLocation
    }
    return app.currentLocation || 'N/A'
  }

  // Helper function to get job type
  const getJobType = (app: JobApplication) => {
    if (typeof app.jobId === 'object' && app.jobId?.jobType) {
      return app.jobId.jobType
    }
    return 'N/A'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-[#617589] dark:text-gray-400">Loading your applications...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <p className="text-red-700 dark:text-red-200 mb-4">{error}</p>
        <button
          onClick={fetchApplications}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
          <span className="material-symbols-outlined text-3xl text-blue-600 dark:text-blue-400">description</span>
        </div>
        <h3 className="text-lg font-semibold text-[#0d141b] dark:text-white mb-2">No applications yet</h3>
        <p className="text-[#617589] dark:text-gray-400 mb-6">You haven't submitted any job applications.</p>
        <a
          href="/jobs"
          className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Browse Jobs
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0d141b] dark:text-white">My Applications</h2>
          <p className="text-[#617589] dark:text-gray-400 mt-1">
            You have submitted <span className="font-semibold text-[#0d141b] dark:text-white">{totalApplications}</span> application{totalApplications !== 1 ? 's' : ''}
            {totalPages > 0 && (
              <span className="ml-2">- Page {currentPage} of {totalPages}</span>
            )}
          </p>
        </div>
        <button
          onClick={() => fetchApplications(currentPage)}
          className="px-4 py-2 text-sm font-medium text-[#111418] dark:text-white border border-[#d0d8e0] dark:border-slate-700 rounded-lg hover:bg-[#f6f7f8] dark:hover:bg-slate-700 transition-colors"
        >
          <span className="material-symbols-outlined inline text-lg mr-2">refresh</span>
          Refresh
        </button>
      </div>

      {/* Table - Desktop */}
      <div className="hidden md:block overflow-x-auto bg-white dark:bg-slate-800 rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-[#f6f7f8] dark:bg-slate-700 border-b border-[#d0d8e0] dark:border-slate-600">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#111418] dark:text-white">Job Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#111418] dark:text-white">Company</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#111418] dark:text-white">Location</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#111418] dark:text-white">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#111418] dark:text-white">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#111418] dark:text-white">Applied</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-[#111418] dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} className="border-b border-[#d0d8e0] dark:border-slate-600 hover:bg-[#f9fafb] dark:hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-[#0d141b] dark:text-white">{getJobTitle(app)}</td>
                <td className="px-6 py-4 text-sm text-[#617589] dark:text-gray-400">{getCompanyName(app)}</td>
                <td className="px-6 py-4 text-sm text-[#617589] dark:text-gray-400">{getLocation(app)}</td>
                <td className="px-6 py-4 text-sm text-[#617589] dark:text-gray-400">{getJobType(app)}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[#617589] dark:text-gray-400">{formatDate(app.appliedAt)}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleViewApplication(app)}
                      title="View details"
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownloadResume(app.resumePath)}
                      title="Download resume"
                      className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(app)}
                      title="Delete application"
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {applications.map((app) => (
          <div key={app._id} className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-[#d0d8e0] dark:border-slate-700">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-[#0d141b] dark:text-white">{getJobTitle(app)}</h3>
                <p className="text-sm text-[#617589] dark:text-gray-400">{getCompanyName(app)}</p>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                {app.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
              <div>
                <p className="text-[#617589] dark:text-gray-400">Location</p>
                <p className="text-[#0d141b] dark:text-white font-medium">{getLocation(app)}</p>
              </div>
              <div>
                <p className="text-[#617589] dark:text-gray-400">Type</p>
                <p className="text-[#0d141b] dark:text-white font-medium">{getJobType(app)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[#617589] dark:text-gray-400">Applied on</p>
                <p className="text-[#0d141b] dark:text-white font-medium">{formatDate(app.appliedAt)}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleViewApplication(app)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
              <button
                onClick={() => handleDownloadResume(app.resumePath)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <Download className="w-4 h-4" />
                Resume
              </button>
              <button
                onClick={() => handleDeleteClick(app)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Application Modal */}
      {showViewModal && selectedApplication && (
        <ViewApplicationModal
          application={selectedApplication}
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false)
            setSelectedApplication(null)
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && applicationToDelete && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setApplicationToDelete(null)
          }}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          applicationTitle={getJobTitle(applicationToDelete)}
          companyName={getCompanyName(applicationToDelete)}
        />
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8 pb-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-[#111418] dark:text-white border border-[#d0d8e0] dark:border-slate-700 rounded-lg hover:bg-[#f6f7f8] dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <div className="text-sm text-[#617589] dark:text-gray-400">
            Page <span className="font-semibold text-[#0d141b] dark:text-white">{currentPage}</span> of <span className="font-semibold text-[#0d141b] dark:text-white">{totalPages}</span>
          </div>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-[#111418] dark:text-white border border-[#d0d8e0] dark:border-slate-700 rounded-lg hover:bg-[#f6f7f8] dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
