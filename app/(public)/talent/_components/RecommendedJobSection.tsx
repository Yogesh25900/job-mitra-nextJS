import RecommendedJob from './RecommendedJob'

const recommendedJobs = [
  {
    company: 'Linear',
    title: 'Senior UI Designer',
    location: 'Remote',
    salary: '$120k - $150k',
    initials: 'L',
    initialsColor:
      'bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400',
  },
  {
    company: 'Airbnb',
    title: 'Product Manager',
    location: 'San Francisco',
    salary: '$140k - $180k',
    initials: 'A',
    initialsColor:
      'bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400',
  },
  {
    company: 'Twitter',
    title: 'Frontend Engineer',
    location: 'London, UK',
    salary: '£80k - £100k',
    initials: 'T',
    initialsColor:
      'bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400',
  },
]

export default function RecommendedJobsSection() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Recommended for you
        </h2>
        <div className="flex gap-2">
          <button className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {recommendedJobs.map((job, index) => (
            <RecommendedJob key={index} {...job} />
          ))}
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 text-center border-t border-slate-200 dark:border-slate-700">
          <button className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors">
            View all 24 recommendations
          </button>
        </div>
      </div>
    </section>
  )
}