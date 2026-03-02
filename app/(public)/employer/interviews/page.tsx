'use client'

export default function EmployerInterviewsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Interviews
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base mt-1">
            Schedule and manage interviews with candidates
          </p>
        </div>
      </div>

      {/* Placeholder - TODO: Integrate interview management */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 text-center">
        <span className="material-symbols-outlined text-[48px] text-slate-400 mx-auto block mb-4">
          calendar_today
        </span>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          No Interviews Scheduled
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Schedule interviews with your shortlisted candidates to get started.
        </p>
      </div>
    </div>
  )
}
