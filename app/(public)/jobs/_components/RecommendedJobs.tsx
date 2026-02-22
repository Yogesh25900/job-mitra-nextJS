"use client"

import { useEffect, useState } from 'react'
import { handleGetRecommendedJobs } from '@/lib/actions/recommendation-actions'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

interface RecommendedJob {
  id: string
  jobTitle: string
  companyName: string
  jobLocation?: string
  jobType?: string
  experienceLevel?: string
  matchScore?: number
  jobCategory?: {
    name: string
  }
  tags?: string[]
}

export default function RecommendedJobs() {
  const [jobs, setJobs] = useState<RecommendedJob[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      try {
        setIsLoading(true)
        
        // Only fetch if user is authenticated
        if (!isAuthenticated || !user) {
          setJobs([])
          setIsLoading(false)
          return
        }

        const response = await handleGetRecommendedJobs(3)
        
        if (response.success && response.data) {
          // Ensure we have an array and limit to 3 items
          const jobsArray = Array.isArray(response.data) ? response.data : []
          setJobs(jobsArray.slice(0, 3))
        } else {
          setJobs([])
        }
      } catch (err) {
        console.error('Failed to fetch recommended jobs:', err)
        setJobs([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendedJobs()
  }, [isAuthenticated, user])

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
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#e7edf3] dark:border-slate-800 shadow-sm p-6">
        <h4 className="text-[#0d141b] dark:text-white font-bold mb-4">
          Recommended for you
        </h4>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#e7edf3] dark:border-slate-800 shadow-sm p-6">
        <h4 className="text-[#0d141b] dark:text-white font-bold mb-4">
          Recommended for you
        </h4>
        <p className="text-[#617589] text-sm">No recommendations available</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#e7edf3] dark:border-slate-800 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-[#0d141b] dark:text-white font-bold">
          Recommended for you
        </h4>
        {isAuthenticated && (
          <a
            href="/talent/recommendations"
            className="text-primary text-xs font-bold hover:underline"
          >
            See all
          </a>
        )}
      </div>

      <div className="flex flex-col gap-5">
        {jobs.map((job) => (
          <div 
            key={job.id} 
            className="flex items-start gap-4 cursor-pointer hover:opacity-75 transition-opacity"
            onClick={() => router.push(`/jobs/details/${job.id}`)}
          >
            <div className="size-10 bg-slate-50 dark:bg-slate-800 rounded flex items-center justify-center flex-shrink-0 border border-[#e7edf3] dark:border-slate-700">
              <span className="material-symbols-outlined text-primary text-xl">
                {getCategoryIcon(job.jobCategory?.name)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#0d141b] dark:text-slate-100 line-clamp-1">
                {job.jobTitle}
              </p>
              <p className="text-xs text-[#4c739a] dark:text-slate-400 line-clamp-1">
                {job.companyName} {job.jobLocation ? `• ${job.jobLocation}` : ''}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}