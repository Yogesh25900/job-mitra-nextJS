'use client'

import SavedJobsManagement from "../_components/SavedJobsManagement"

export default function TalentSavedPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Saved Jobs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base mt-1">
            Your collection of saved job postings
          </p>
        </div>
      </div>
      <SavedJobsManagement />
    </div>
  )
}
