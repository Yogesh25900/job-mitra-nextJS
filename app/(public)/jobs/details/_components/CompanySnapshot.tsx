import Link from 'next/link'

interface CompanyInfo {
  name: string
  industry: string
  size: string
  headquarters: string
  website: string
  mapImageUrl: string
}

export default function CompanySnapshot({ company }: { company: CompanyInfo }) {
  return (
    <div className="rounded-xl bg-surface-light dark:bg-surface-dark p-6 shadow-sm border border-slate-200 dark:border-slate-800/50">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        About the Company
      </h3>
      <div className="flex items-center gap-3 mb-4">
        
        <span className="text-lg font-bold text-slate-900 dark:text-white">{company.name}</span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Industry</span>
          <span className="font-medium text-slate-900 dark:text-white">{company.industry}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Company Size</span>
          <span className="font-medium text-slate-900 dark:text-white">{company.size}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Headquarters</span>
          <span className="font-medium text-slate-900 dark:text-white">
            {company.headquarters}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Website</span>
          <Link href="#" className="font-medium text-primary hover:underline">
            {company.website}
          </Link>
        </div>
      </div>
      <div className="mt-6 h-32 w-full overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: `url('${company.mapImageUrl}')`,
          }}
        ></div>
      </div>
    </div>
  )
}