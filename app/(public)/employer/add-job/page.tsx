'use client'

import Link from 'next/link'
import JobFormWizard from '../_components/job-form/JobFormWizard'

export default function AddJobPage() {
  return (
    <div className="min-h-screen w-full flex justify-center px-4 py-8 md:py-12">
      <div className="w-full max-w-4xl">
        <Link
          href="/employer"
          className="text-primary hover:underline text-sm font-semibold mb-4 inline-flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to job list
        </Link>
        <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">
          Create a new job
        </h1>
        <p className="text-[#617589] mb-8">
          Build a clear and compelling job post in four quick steps.
        </p>

        <JobFormWizard mode="create" />
      </div>
    </div>
  )
}
