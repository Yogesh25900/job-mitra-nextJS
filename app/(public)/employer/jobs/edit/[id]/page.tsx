'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import JobFormWizard, { JobFormData } from '../../../_components/job-form/JobFormWizard'
import { getJobById } from '@/lib/api/job'

interface BackendJob {
  _id: string
  jobTitle: string
  companyName: string
  jobLocation: string
  jobType: string
  experienceLevel: string
  jobCategory?: string
  jobDescription: string
  applicationDeadline: string
  responsibilities?: string[]
  qualifications?: string[]
  tags?: string[]
  status?: 'Active' | 'Inactive' | 'Closed'
}

export default function EditJobPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = typeof params.id === 'string' ? params.id : params.id?.[0]

  const [job, setJob] = useState<BackendJob | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await getJobById(jobId)
        if (response.success && response.data) {
          setJob(response.data)
        } else {
          toast.error(response.message || 'Failed to load job')
        }
      } catch (error: any) {
        toast.error(error?.message || 'Failed to load job')
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [jobId])

  const initialData: Partial<JobFormData> | undefined = useMemo(() => {
    if (!job) {
      return undefined
    }

    return {
      jobTitle: job.jobTitle,
      companyName: job.companyName,
      jobLocation: job.jobLocation,
      jobType: job.jobType,
      experienceLevel: job.experienceLevel,
      jobCategory: job.jobCategory || '',
      jobDescription: job.jobDescription,
      applicationDeadline: job.applicationDeadline,
      responsibilities: job.responsibilities || [],
      qualifications: job.qualifications || [],
      tags: job.tags || [],
      status: job.status || 'Active',
    }
  }, [job])

  if (loading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center px-4">
        <div className="flex flex-col items-center gap-3 text-[#617589]">
          <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          <p>Loading job details...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center px-4">
        <div className="text-center">
          <p className="text-[#617589] mb-4">Job not found.</p>
          <button
            onClick={() => router.push('/employer')}
            className="text-primary hover:underline text-sm font-semibold"
          >
            Back to job list
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex justify-center px-4 py-8 md:py-12">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">
          Edit job posting
        </h1>
        <p className="text-[#617589] mb-8">
          Update the details below and keep your listing fresh.
        </p>
        <JobFormWizard
          mode="edit"
          jobId={jobId}
          initialData={initialData}
          onSuccess={() => router.push('/employer')}
        />
      </div>
    </div>
  )
}
