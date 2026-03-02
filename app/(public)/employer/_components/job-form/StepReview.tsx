import { Category } from '@/lib/api/category'

interface StepReviewProps {
  data: {
    jobTitle: string
    companyName: string
    jobLocation: string
    jobType: string
    jobCategory: string
    experienceLevel: string
    jobDescription: string
    responsibilities: string[]
    qualifications: string[]
    tags: string[]
    applicationDeadline: string
    status: string
  }
  categories?: Category[]
}

export default function StepReview({ data, categories = [] }: StepReviewProps) {
  const getCategoryName = (categoryId: string): string => {
    if (!categoryId) return 'Category'
    const category = categories.find((cat) => cat._id === categoryId)
    return category?.name || 'Unknown Category'
  }
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#111418] dark:text-white">
        Review and Submit
      </h2>

      <div className="space-y-4">
        <div className="rounded-lg border border-[#e7edf3] dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          <p className="text-sm font-semibold text-[#4c739a]">Job Snapshot</p>
          <h3 className="text-lg font-bold text-[#111418] dark:text-white mt-2">
            {data.jobTitle || 'Untitled Role'}
          </h3>
          <p className="text-sm text-[#617589]">
            {data.companyName || 'Company'}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
              {data.jobType || 'Job type'}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#f0f2f4] dark:bg-slate-800 text-[#617589]">
              {data.experienceLevel || 'Experience'}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#f0f2f4] dark:bg-slate-800 text-[#617589]">
              {data.jobLocation || 'Location'}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#f0f2f4] dark:bg-slate-800 text-[#617589]">
              {getCategoryName(data.jobCategory)}
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-[#e7edf3] dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          <p className="text-sm font-semibold text-[#4c739a] mb-2">
            Description
          </p>
          <p className="text-sm text-[#111418] dark:text-white whitespace-pre-wrap">
            {data.jobDescription || 'No description provided.'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[#e7edf3] dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
            <p className="text-sm font-semibold text-[#4c739a] mb-2">
              Responsibilities
            </p>
            <ul className="space-y-2 text-sm text-[#111418] dark:text-white list-disc pl-5">
              {data.responsibilities.length > 0 ? (
                data.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))
              ) : (
                <li className="text-[#617589]">No responsibilities added.</li>
              )}
            </ul>
          </div>

          <div className="rounded-lg border border-[#e7edf3] dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
            <p className="text-sm font-semibold text-[#4c739a] mb-2">
              Qualifications
            </p>
            <ul className="space-y-2 text-sm text-[#111418] dark:text-white list-disc pl-5">
              {data.qualifications.length > 0 ? (
                data.qualifications.map((item) => (
                  <li key={item}>{item}</li>
                ))
              ) : (
                <li className="text-[#617589]">No qualifications added.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="rounded-lg border border-[#e7edf3] dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          <div className="flex flex-wrap gap-3 text-sm text-[#111418] dark:text-white">
            <span className="text-[#617589]">Deadline:</span>
            <span>{data.applicationDeadline || 'Not set'}</span>
            <span className="text-[#617589]">Status:</span>
            <span>{data.status}</span>
          </div>
          {data.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
