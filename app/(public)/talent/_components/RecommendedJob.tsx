interface RecommendedJobProps {
  company: string
  title: string
  location: string
  salary: string
  initials: string
  initialsColor: string
}

export default function RecommendedJob({
  company,
  title,
  location,
  salary,
  initials,
  initialsColor,
}: RecommendedJobProps) {
  return (
    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <div className="flex items-center gap-4">
        <div
          className={`size-12 rounded-lg ${initialsColor} flex items-center justify-center font-bold text-lg`}
        >
          {initials}
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            {title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400 mt-1">
            <span>{company}</span>
            <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
            <span>{location}</span>
            <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
            <span>{salary}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">bookmark</span>
        </button>
        <button className="px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-lg hover:bg-primary hover:text-white transition-all">
          Quick Apply
        </button>
      </div>
    </div>
  )
}