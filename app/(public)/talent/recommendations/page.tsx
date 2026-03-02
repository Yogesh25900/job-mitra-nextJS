'use client'

import { useEffect, useState } from 'react'
import { handleGetRecommendedJobs } from '@/lib/actions/recommendation-actions'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { Loader2, AlertCircle, BookmarkX } from 'lucide-react'
import Link from 'next/link'

interface RecommendedJob {
  id: string
  jobTitle: string
  companyName: string
  jobLocation?: string
  jobType?: string
  experienceLevel?: string
  matchScore: number
  reason?: {
    skills_matched_in_job?: string[]
    matched_by_description?: string[]
    matched_by_tags?: string[]
    candidate_skills?: string[]
    job_description_snippet?: string
  }
  jobCategory?: {
    _id: string
    name: string
    icon?: string
    color?: string
  }
  employerId?: string | {
    _id: string
    companyName: string
    logoPath?: string
  }
  jobDescription?: string
  tags?: string[]
  applicationDeadline?: string
}

export default function RecommendationsPage() {
  const [jobs, setJobs] = useState<RecommendedJob[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const fetchRecommendations = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await handleGetRecommendedJobs(50) // Get up to 50 recommendations
        console.log('Recommendations response:', response)
        if (response.success && response.data) {
          const jobsArray = Array.isArray(response.data) ? response.data : []
          setJobs(jobsArray)
        } else {
          setError(response.message || 'Failed to fetch recommendations')
          setJobs([])
        }
      } catch (err) {
        console.error('Failed to fetch recommendations:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch recommendations')
        setJobs([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [isAuthenticated, router])

  const getCategoryIcon = (category: string | undefined): string => {
    const iconMap: Record<string, string> = {
      'information technology': 'computer',
      'finance & accounting': 'attach_money',
      'human resources': 'groups',
      'engineering': 'engineering',
      'marketing & sales': 'trending_up',
      'healthcare': 'local_hospital',
      'manufacturing': 'factory',
      'education': 'school',
      'legal': 'gavel',
      'hospitality & tourism': 'hotel',
    }

    return iconMap[category?.toLowerCase() || ''] || 'work'
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Recommended Jobs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base mt-1">
            Personalized job recommendations based on your profile
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#e7edf3] dark:border-slate-800 shadow-sm p-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Recommended Jobs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base mt-1">
            Personalized job recommendations based on your profile
          </p>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 shadow-sm p-6 flex gap-4">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-400">
              Failed to load recommendations
            </h3>
            <p className="text-red-800 dark:text-red-300 text-sm mt-1">
              {error}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Recommended Jobs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base mt-1">
            Personalized job recommendations based on your profile
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#e7edf3] dark:border-slate-800 shadow-sm p-12 flex flex-col items-center justify-center gap-4">
          <BookmarkX className="h-12 w-12 text-slate-400 dark:text-slate-600" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              No recommendations yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
              Complete your profile to get personalized job recommendations
            </p>
            <Link
              href="/talent/profile/edit"
              className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Complete Profile
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Recommended Jobs
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base mt-1">
          {jobs.length} personalized job recommendations for you
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/details/${job.id}`}
            className="group bg-white dark:bg-slate-900 rounded-xl border border-[#e7edf3] dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/30 dark:hover:border-primary/30 transition-all p-6"
          >
            <div className="flex gap-4 items-start">
              {/* Category Icon */}
              <div className="flex-shrink-0">
                <div className={`size-12 rounded-lg flex items-center justify-center border border-[#e7edf3] dark:border-slate-700 ${
                  job.jobCategory?.color 
                    ? `bg-[${job.jobCategory.color}]/10` 
                    : 'bg-slate-50 dark:bg-slate-800'
                }`}>
                  <span className="material-symbols-outlined text-xl text-primary">
                    {getCategoryIcon(job.jobCategory?.name)}
                  </span>
                </div>
              </div>

              {/* Job Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                      {job.jobTitle}
                    </h3>
                    <p className="text-[#4c739a] dark:text-slate-400 text-sm mt-1">
                      {job.companyName} {job.jobLocation ? `• ${job.jobLocation}` : ''}
                    </p>
                  </div>
                </div>

                {/* Match Score Badge */}
                <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <span className="material-symbols-outlined text-sm text-green-700 dark:text-green-400">
                    trending_up
                  </span>
                  <span className="text-sm font-bold text-green-700 dark:text-green-400">
                    {job.matchScore.toFixed(1)}% Match
                  </span>
                </div>

                {/* Job Details */}
                {(job.jobType || job.experienceLevel) && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {job.jobType && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                        <span className="material-symbols-outlined text-sm">
                          work
                        </span>
                        {job.jobType}
                      </span>
                    )}
                    {job.experienceLevel && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                        <span className="material-symbols-outlined text-sm">
                          trending_up
                        </span>
                        {job.experienceLevel}
                      </span>
                    )}
                    {job.jobCategory && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {job.jobCategory.name}
                      </span>
                    )}
                  </div>
                )}

                {/* Tags */}
                {job.tags && job.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                    {job.tags.length > 3 && (
                      <span className="inline-flex px-2.5 py-1 text-xs text-slate-500 dark:text-slate-400">
                        +{job.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Match Reason */}
                {job.reason?.job_description_snippet && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 line-clamp-2 italic">
                    "{job.reason.job_description_snippet}"
                  </p>
                )}
              </div>

              {/* Application Deadline */}
              {job.applicationDeadline && (
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Deadline
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {new Date(job.applicationDeadline).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
