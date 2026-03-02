"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import ActionCard from "../_components/ActionCard"
import Breadcrumbs from "../_components/Breadcrumbs"
import CompanySnapshot from "../_components/CompanySnapshot"
import JobDescription from "../_components/JobDescription"
import JobHeader from "../_components/JobHeader"
import { handleGetJobById } from "@/lib/actions/job-actions"

interface BackendJob {
  _id: string
  jobTitle: string
  companyName: string
  jobLocation: string
  jobType: string
  experienceLevel: string
  jobCategory: {
    name: string
  } 
  jobDescription: string
  applicationDeadline?: string
  responsibilities?: string[]
  qualifications?: string[]
  tags?: string[]
  companyProfilePicPath?: string
  status?: string
  employerId?: { _id: string; companyName: string; logoPath?: string ;companySize?: string; website?: string}
  createdAt: string
  updatedAt?: string
}

export default function JobDetailsPage() {
  const params = useParams()
  const jobId = params.id as string
  const [job, setJob] = useState<BackendJob | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return

      try {
        setIsLoading(true)
        const response = await handleGetJobById(jobId)
        console.log("Job details response:", response)

        if (response.success && response.data) {
          setJob(response.data)
          setError(null)
        } else {
          setError(response.message || "Failed to fetch job details")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobDetails()
  }, [jobId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-[#617589]">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Job not found"}</p>
          <a href="/jobs" className="text-primary hover:underline">
            Back to jobs
          </a>
        </div>
      </div>
    )
  }

  const postedDate = new Date(job.createdAt)
  const today = new Date()
  const daysAgo = Math.floor((today.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24))

  const jobData = {
    title: job.jobTitle,
    company: job.companyName,
    location: job.jobLocation,
    postedDaysAgo: daysAgo,
    salary: "Competitive",
    jobType: job.jobType,
    website: job.employerId?.website || "",
    level: job.experienceLevel,
    aboutRole: [job.jobDescription],
    responsibilities: job.responsibilities || [],
    requirements: job.qualifications || [],
    techStack: job.tags || [],
  }

  const companyInfo = {
    name: job.companyName,
    industry: job.jobCategory?.name,
    size: job.employerId?.companySize || "Not specified",
    headquarters: job.jobLocation,
    website: job.employerId?.website ||  "company-website.com",
    mapImageUrl: job.employerId?.logoPath ? `http://localhost:5050/logos/${job.employerId.logoPath}` : "",
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Jobs", href: "/jobs" },
            { label: jobData.title },
          ]}
        />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Content */}
          <div className="lg:col-span-8 space-y-8">
            <JobHeader
              title={jobData.title}
              company={jobData.company}
              logoPath={job.employerId?.logoPath}
              location={jobData.location}
              postedDaysAgo={jobData.postedDaysAgo}
              salary={jobData.salary}
              jobType={jobData.jobType}
              level={jobData.level}
            />
            <JobDescription
              aboutRole={jobData.aboutRole}
              responsibilities={jobData.responsibilities}
              requirements={jobData.requirements}
              techStack={jobData.techStack}
            />
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <ActionCard jobId={jobId} />
              <CompanySnapshot company={companyInfo} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
