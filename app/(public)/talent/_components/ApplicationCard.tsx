interface ApplicationCardProps {
  logo: string
  title: string
  company: string
  location: string
  status: 'Interview' | 'In Review' | 'Applied'
  appliedDate: string
}

const statusConfig = {
  Interview: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    darkBg: 'dark:bg-green-900/30',
    darkText: 'dark:text-green-300',
  },
  'In Review': {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    darkBg: 'dark:bg-amber-900/30',
    darkText: 'dark:text-amber-300',
  },
  Applied: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    darkBg: 'dark:bg-blue-900/30',
    darkText: 'dark:text-blue-300',
  },
}

export default function ApplicationCard({
  logo,
  title,
  company,
  location,
  status,
  appliedDate,
}: ApplicationCardProps) {
  const config = statusConfig[status]

  return (
    <div className="bg-white dark:bg-[#1a2632] p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <div className="size-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={logo}
              alt={`${company} logo`}
            />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {company} • {location}
            </p>
          </div>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.darkBg} ${config.darkText}`}
        >
          {status}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2 pt-3 border-t border-slate-100 dark:border-slate-700">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">
            calendar_today
          </span>
          Applied {appliedDate}
        </span>
        <button className="font-medium text-primary hover:underline">
          Details
        </button>
      </div>
    </div>
  )
}