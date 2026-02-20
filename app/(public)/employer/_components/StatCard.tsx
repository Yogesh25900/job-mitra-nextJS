interface StatCardProps {
  title: string
  value: string | number
  trend: number
  trendDirection: 'up' | 'down'
}

export default function StatCard({
  title,
  value,
  trend,
  trendDirection,
}: StatCardProps) {
  const isPositive = trendDirection === 'up'
  const trendColor = isPositive ? '#078838' : '#e73908'
  const bgColor = isPositive
    ? 'bg-green-50 dark:bg-green-900/20'
    : 'bg-red-50 dark:bg-red-900/20'

  return (
    <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#cfdbe7] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <p className="text-[#4c739a] dark:text-slate-400 text-sm font-medium">
        {title}
      </p>
      <div className="flex items-end justify-between">
        <p className="tracking-tight text-3xl font-bold leading-none">
          {value}
        </p>
        <p
          className={`text-sm font-bold flex items-center ${bgColor} px-2 py-0.5 rounded-full`}
          style={{ color: trendColor }}
        >
          <span className="material-symbols-outlined text-[16px]">
            {isPositive ? 'trending_up' : 'trending_down'}
          </span>
          {trend}%
        </p>
      </div>
    </div>
  )
}