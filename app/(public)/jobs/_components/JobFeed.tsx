"use client"

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import JobCard from './JobCard'
import { handleGetAllJobs, handleSearchJobs } from '@/lib/actions/job-actions'
import { useRouter } from 'next/navigation'

interface BackendJob {
  _id: string
  jobTitle: string
  companyName: string
  jobLocation: string
  jobType: string
  experienceLevel: string
  jobCategory: string | { _id: string; name: string; description?: string; icon?: string; color?: string; isActive?: boolean; createdAt?: string; updatedAt?: string }
  jobDescription: string
  applicationDeadline?: string
  responsibilities?: string[]
  qualifications?: string[]
  tags?: string[]
  companyProfilePicPath?: string
  status?: string
  employerId?: { _id: string; companyName: string; logoPath?: string }
  createdAt: string
  updatedAt?: string
}

interface Metadata {
  total: number
  page: number
  size: number
  totalPages: number
}

const JOBS_PER_PAGE = 6

export default function JobFeed() {
  const [jobs, setJobs] = useState<BackendJob[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [metadata, setMetadata] = useState<Metadata | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  const jobTitle = searchParams.get('jobTitle') || ''
  const location = searchParams.get('location') || ''
  const jobCategory = searchParams.get('jobCategory') || ''
  const hasSearch = Boolean(jobTitle || location || jobCategory)

  const fetchJobs = useCallback(async (page: number = 1) => {
    try {
      setIsLoading(true)
      let response

      if (jobTitle || location || jobCategory) {
        // Use search endpoint with filters
        response = await handleSearchJobs({ jobTitle, location, jobCategory }, page, JOBS_PER_PAGE)
      } else {
        // Use get all jobs endpoint
        response = await handleGetAllJobs(page, JOBS_PER_PAGE)
      }
      console.log('Job fetch response:', response)

      if (response.success && response.data) {
        setJobs(response.data)
        setMetadata(response.metadata || null)
        setError(null)
      } else {
        setError(response.message || 'Failed to fetch jobs')
        setJobs([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setJobs([])
    } finally {
      setIsLoading(false)
    }
  }, [jobTitle, location, jobCategory])

  useEffect(() => {
    setCurrentPage(1)
    fetchJobs(1)
  }, [jobTitle, location, jobCategory, fetchJobs])

  const handleApply = (jobId: string, jobTitle: string) => {
    router.push(`/jobs/apply?jobId=${jobId}`)
  }

  const handleNextPage = () => {
    if (metadata && currentPage < metadata.totalPages) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      fetchJobs(nextPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1
      setCurrentPage(prevPage)
      fetchJobs(prevPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (isLoading) {
    return (
      <div className="lg:col-span-8 flex flex-col gap-5">
        <h3 className="text-[#0d141b] dark:text-white text-xl font-bold px-1 mb-2">
          Latest Job Openings
        </h3>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-[#617589]">Loading jobs...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="lg:col-span-8 flex flex-col gap-5">
        <h3 className="text-[#0d141b] dark:text-white text-xl font-bold px-1 mb-2">
          Latest Job Openings
        </h3>
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="lg:col-span-8 flex flex-col gap-5">
        <h3 className="text-[#0d141b] dark:text-white text-xl font-bold px-1 mb-2">
          Latest Job Openings
        </h3>
        <div className="text-center py-12">
          <p className="text-[#617589]">No jobs found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="lg:col-span-8 flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[#0d141b] dark:text-white text-xl font-bold px-1 mb-2">
          {hasSearch ? 'Filtered Job Results' : 'Latest Job Openings'}
          {metadata && ` (${metadata.total})`}
        </h3>
      </div>

      {jobs.length === 0 && !isLoading ? (
        <div className="text-center py-12 bg-[#f6f7f8] dark:bg-slate-800 rounded-lg">
          <p className="text-[#617589]">No jobs found matching your search</p>
        </div>
      ) : (
        <>
          {/* Job Cards */}
          <div className="flex flex-col gap-4">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                jobId={job._id}
                jobTitle={job.jobTitle}
                company={job.companyName}
                location={job.jobLocation}
                jobType={job.jobType}
                category={typeof job.jobCategory === 'object' ? job.jobCategory?.name || 'Other' : job.jobCategory}
                experienceLevel={job.experienceLevel}
                tags={job.tags || []}
                deadline={job.applicationDeadline || 'No deadline'}
                companyProfilePicPath={job.employerId?.logoPath || '/logos/default.png'}
                onApply={() => handleApply(job._id, job.jobTitle)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {metadata && metadata.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#d0d8e0] dark:border-slate-700">
              <div className="text-sm text-[#617589]">
                Page {metadata.page} of {metadata.totalPages} • Showing {jobs.length} of {metadata.total} jobs
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                    currentPage === 1
                      ? 'bg-[#f0f2f4] dark:bg-slate-700 text-[#617589] cursor-not-allowed'
                      : 'border border-[#d0d8e0] dark:border-slate-700 text-[#111418] dark:text-white hover:bg-[#f6f7f8] dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1 items-center px-2">
                  {Array.from({ length: metadata.totalPages }, (_, i) => {
                    const pageNum = i + 1
                    // Show current page and 1 page on each side (or more if at the edges)
                    if (
                      pageNum === currentPage ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1) ||
                      (currentPage <= 2 && pageNum <= 3) ||
                      (currentPage >= metadata.totalPages - 1 && pageNum >= metadata.totalPages - 2)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setCurrentPage(pageNum)
                            fetchJobs(pageNum)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                          className={`w-8 h-8 rounded text-sm font-semibold transition-colors ${
                            pageNum === currentPage
                              ? 'bg-primary text-white'
                              : 'bg-[#f0f2f4] dark:bg-slate-700 text-[#111418] dark:text-white hover:bg-[#e0e4e8] dark:hover:bg-slate-600'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    } else if (
                      (pageNum === currentPage - 2 && currentPage > 3) ||
                      (pageNum === currentPage + 2 && currentPage < metadata.totalPages - 2)
                    ) {
                      return (
                        <div key={pageNum} className="text-[#617589]">
                          ...
                        </div>
                      )
                    }
                    return null
                  })}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= metadata.totalPages}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                    currentPage >= metadata.totalPages
                      ? 'bg-[#f0f2f4] dark:bg-slate-700 text-[#617589] cursor-not-allowed'
                      : 'border border-[#d0d8e0] dark:border-slate-700 text-[#111418] dark:text-white hover:bg-[#f6f7f8] dark:hover:bg-slate-800'
                  }`}
                >
                  Next
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
