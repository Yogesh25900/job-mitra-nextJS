'use client'

export default function EmployerCandidatesPage() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">
          Candidates
        </h1>
        <p className="text-[#617589] dark:text-slate-400 mb-8">
          View and manage candidates who have applied to your jobs.
        </p>

        {/* Placeholder - TODO: Integrate candidates list and management */}
        <div className="rounded-lg border border-[#e7edf3] dark:border-slate-800 bg-[#f6f7f8] dark:bg-slate-800 p-8 text-center">
          <span className="material-symbols-outlined text-[48px] text-[#4c739a] mx-auto block mb-4">
            group_outline
          </span>
          <h2 className="text-xl font-semibold text-[#111418] dark:text-white mb-2">
            Candidates Management Coming Soon
          </h2>
          <p className="text-[#617589] dark:text-slate-400">
            Advanced candidate management tools will be available soon.
          </p>
        </div>
      </div>
    </div>
  )
}
