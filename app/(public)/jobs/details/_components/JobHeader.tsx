interface JobHeaderProps {
  title: string
  company: string
  logoPath?: string
  location: string
  postedDaysAgo: number
  salary: string
  jobType: string
  level: string
}

export default function JobHeader({
  title,
  company,
  logoPath,
  location,
  postedDaysAgo,
  salary,
  jobType,
  level,
}: JobHeaderProps) {
  return (
    <div className="rounded-xl bg-surface-light dark:bg-surface-dark p-6 shadow-sm border border-slate-200 dark:border-slate-800/50">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-white p-1 border border-slate-200 dark:border-slate-700 dark:bg-slate-800">
            <div
              className="h-full w-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('http://localhost:5050/logos/${logoPath}')`,
              }}
            ></div>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">apartment</span>
                {company}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                {location}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                Posted {postedDaysAgo} days ago
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 self-start">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            title="Share"
          >
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
        </div>
      </div>

      {/* Chips */}
      <div className="mt-6 flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20">
          {jobType}
        </span>
        <span className="inline-flex items-center rounded-md bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/20">
          {salary}
        </span>
        <span className="inline-flex items-center rounded-md bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 dark:bg-purple-400/10 dark:text-purple-400 dark:ring-purple-400/20">
          Remote Friendly
        </span>
        <span className="inline-flex items-center rounded-md bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-700/10 dark:bg-orange-400/10 dark:text-orange-400 dark:ring-orange-400/20">
          {level}
        </span>
      </div>
    </div>
  )
}