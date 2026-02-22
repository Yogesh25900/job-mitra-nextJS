"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { handleAddSavedJob, handleRemoveSavedJob } from "@/lib/actions/saved-jobs-actions"
import { useAuth } from "@/context/AuthContext"
import AuthRequiredModal from "../../_components/AuthRequiredModal"

interface ActionCardProps {
  jobId: string
  isSaved?: boolean
}

export default function ActionCard({ jobId, isSaved: initialSaved = false }: ActionCardProps) {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [isSaved, setIsSaved] = useState(initialSaved)
  const [isLoading, setIsLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleApplyNow = () => {
    if (authLoading) return

    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    router.push(`/jobs/apply?jobId=${jobId}`)
  }

  const handleSaveJob = async () => {
    setIsLoading(true)
    try {
      if (isSaved) {
        const result = await handleRemoveSavedJob(jobId)
        if (result.success) {
          setIsSaved(false)
          toast.success("Job removed from saved list")
        } else {
          toast.error("Failed to remove job")
        }
      } else {
        const result = await handleAddSavedJob(jobId)
        if (result.success) {
          setIsSaved(true)
          toast.success("Job saved successfully!")
        } else {
          toast.error( "Failed to save job")
        }
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="rounded-xl bg-surface-light dark:bg-surface-dark p-6 shadow-md border border-slate-200 dark:border-slate-800/50">
        <button 
          onClick={handleApplyNow}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
          Apply Now
          <span className="material-symbols-outlined text-[20px]">open_in_new</span>
        </button>
        {isAuthenticated && (
          <button 
            onClick={handleSaveJob}
            disabled={isLoading}
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-bold transition-colors ${
              isSaved
                ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            } disabled:opacity-50`}>
            <span className="material-symbols-outlined text-[20px]">
              {isSaved ? 'bookmark' : 'bookmark_border'}
            </span>
            {isSaved ? 'Saved' : 'Save Job'}
          </button>
        )}
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