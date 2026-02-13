interface StatCardProps {
  label: string
  value: string | number
  icon: string
  bgColor: string
  iconColor: string
}

export default function StatCard({
  label,
  value,
  icon,
  bgColor,
  iconColor,
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-[#1a2632] p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
          {label}
        </p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white">
          {value}
        </p>
      </div>
      <div className={`size-12 rounded-full ${bgColor} flex items-center justify-center ${iconColor}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
    </div>
  )
}