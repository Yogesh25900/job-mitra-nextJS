'use client'

import { Category } from '@/lib/api/category'

interface StepJobDetailsProps {
  data: {
    jobTitle: string
    jobLocation: string
    jobType: string
    jobCategory: string
    experienceLevel: string
  }
  errors: Record<string, string>
  onChange: (field: string, value: string) => void
  categories: Category[]
  loadingCategories: boolean
}

export default function StepJobDetails({
  data,
  errors,
  onChange,
  categories,
  loadingCategories,
}: StepJobDetailsProps) {

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#111418] dark:text-white">
        Job Details
      </h2>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
            Job Title *
          </label>
          <input
            type="text"
            value={data.jobTitle}
            onChange={(e) => onChange('jobTitle', e.target.value)}
            placeholder="e.g., Senior Frontend Engineer"
            className="w-full p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.jobTitle && (
            <p className="text-xs text-red-600 mt-1">{errors.jobTitle}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
            Location *
          </label>
          <input
            type="text"
            value={data.jobLocation}
            onChange={(e) => onChange('jobLocation', e.target.value)}
            placeholder="City, State or Remote"
            className="w-full p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.jobLocation && (
            <p className="text-xs text-red-600 mt-1">{errors.jobLocation}</p>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
              Job Type *
            </label>
            <select
              value={data.jobType}
              onChange={(e) => onChange('jobType', e.target.value)}
              className="w-full p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select job type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>
            {errors.jobType && (
              <p className="text-xs text-red-600 mt-1">{errors.jobType}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
              Experience Level *
            </label>
            <select
              value={data.experienceLevel}
              onChange={(e) => onChange('experienceLevel', e.target.value)}
              className="w-full p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select experience level</option>
              <option value="Entry">Entry</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead</option>
              <option value="Executive">Executive</option>
            </select>
            {errors.experienceLevel && (
              <p className="text-xs text-red-600 mt-1">{errors.experienceLevel}</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
            Job Category *
          </label>
          <select
            value={data.jobCategory}
            onChange={(e) => onChange('jobCategory', e.target.value)}
            disabled={loadingCategories}
            className="w-full p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            <option value="">
              {loadingCategories ? 'Loading categories...' : 'Select a category'}
            </option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.jobCategory && (
            <p className="text-xs text-red-600 mt-1">{errors.jobCategory}</p>
          )}
        </div>
      </div>
    </div>
  )
}
