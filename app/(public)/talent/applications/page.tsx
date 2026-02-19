'use client'

import ApplicationsManagement from "../_components/ApplicationsManagement"

export default function TalentApplicationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Applications
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base mt-1">
            Track and manage all your job applications
          </p>
        </div>
      </div>
      <ApplicationsManagement />
    </div>
  )
}
