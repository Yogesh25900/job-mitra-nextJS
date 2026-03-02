"use client"

import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import AuthRequiredModal from "./AuthRequiredModal"

interface JobCardProps {
  jobId: string
  companyProfilePicPath?: string
  jobTitle: string
  company: string
  location: string
  jobType: string
  category: string
  experienceLevel: string
  tags: string[]
  deadline: string
  onApply?: () => void
}

export default function JobCard({
  jobId,
  companyProfilePicPath,
  jobTitle,
  company,
  location,
  jobType,
  category,
  experienceLevel,
  tags,
  deadline,
  onApply,
}: JobCardProps) {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = React.useState(false)

  const handleCardClick = () => {
    router.push(`/jobs/details/${jobId}`)
  }

  const handleApplyClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    if (loading) return

    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    onApply?.()
  }

  return (
    <>
      <div 
        onClick={handleCardClick}
        className="group bg-white dark:bg-slate-900 p-6 rounded-xl border border-[#e7edf3] dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
        <div className="flex flex-col md:flex-row gap-6">
        {/* Company Logo */}
        {companyProfilePicPath && (
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800 flex-shrink-0 border border-[#e7edf3] dark:border-slate-700">
            <Image
              src={`http://localhost:5050/logos/${companyProfilePicPath}`}
              alt={`${company} Logo`}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* Job Info */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Title and Company */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
            <div>
              <p className="text-primary text-lg font-bold group-hover:underline cursor-pointer">
                {jobTitle}
              </p>
              <p className="text-[#4c739a] dark:text-slate-400 text-sm font-medium">
                {company} • {location}
              </p>
            </div>
            <p className="text-[#4c739a] dark:text-slate-500 text-xs font-normal">
              Deadline: {deadline}
            </p>
          </div>

          {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
  <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-full">
    {jobType}
  </span>

  {category && (
    <span className="px-3 py-1 text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 rounded-full">
      {category}
    </span>
  )}

  <span className="px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-full">
    {experienceLevel}
  </span>
</div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Apply Button */}
          <div className="flex justify-end">
            <button
              onClick={handleApplyClick}
              className="px-6 py-2 bg-primary text-white font-bold rounded-lg text-sm hover:bg-primary/90 transition-colors"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
      </div>

      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={() => {
          setShowAuthModal(false)
          router.push("/login")
        }}
        onRegister={() => {
          setShowAuthModal(false)
          router.push("/register")
        }}
      />
    </>
  )
}
