import Link from 'next/link'

interface BackendJob {
  _id: string
  jobTitle: string
  companyName: string
}

interface SuccessScreenProps {
  job: BackendJob
}

export default function SuccessScreen({ job }: SuccessScreenProps) {
  return (
    <div className="max-w-md w-full text-center">
      <div className="mb-6 flex justify-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-green-600 text-4xl">
            check_circle
          </span>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">
        Application Submitted!
      </h2>
      <p className="text-[#617589] mb-6">
        Thank you for applying to <strong>{job.jobTitle}</strong> at{' '}
        <strong>{job.companyName}</strong>
      </p>

      <div className="bg-[#f6f7f8] dark:bg-slate-800 rounded-lg p-4 mb-6 text-left">
        <p className="text-sm font-semibold text-[#111418] dark:text-white mb-3">
          What happens next?
        </p>
        <div className="space-y-2">
          <div className="flex gap-3">
            <span className="text-primary font-bold flex-shrink-0">1</span>
            <p className="text-sm text-[#617589]">
              Recruiters will review your application
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-primary font-bold flex-shrink-0">2</span>
            <p className="text-sm text-[#617589]">
              You'll receive updates via email
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-primary font-bold flex-shrink-0">3</span>
            <p className="text-sm text-[#617589]">
              Next steps will be communicated
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          href="/jobs"
          className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          Browse More Jobs
        </Link>
        <Link
          href="/talent"
          className="flex-1 border border-[#f0f2f4] dark:border-slate-700 text-[#111418] dark:text-white font-bold py-3 px-4 rounded-lg hover:bg-[#f6f7f8] dark:hover:bg-slate-800 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
