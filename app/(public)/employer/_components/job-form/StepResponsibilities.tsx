interface StepResponsibilitiesProps {
  data: {
    jobDescription: string
    responsibilities: string[]
    qualifications: string[]
  }
  errors: Record<string, string>
  onChange: (field: string, value: string) => void
  onAddItem: (field: 'responsibilities' | 'qualifications', value: string) => void
  onRemoveItem: (field: 'responsibilities' | 'qualifications', value: string) => void
}

export default function StepResponsibilities({
  data,
  errors,
  onChange,
  onAddItem,
  onRemoveItem,
}: StepResponsibilitiesProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#111418] dark:text-white">
        Responsibilities and Qualifications
      </h2>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
            Job Description *
          </label>
          <textarea
            value={data.jobDescription}
            onChange={(e) => onChange('jobDescription', e.target.value)}
            placeholder="Describe the role, team, and impact"
            className="w-full p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[140px]"
          />
          {errors.jobDescription && (
            <p className="text-xs text-red-600 mt-1">{errors.jobDescription}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
            Responsibilities *
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add a responsibility and press Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const input = e.currentTarget as HTMLInputElement
                  onAddItem('responsibilities', input.value)
                  input.value = ''
                }
              }}
              className="flex-1 p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {data.responsibilities.map((item) => (
              <div
                key={item}
                className="px-3 py-1.5 bg-primary/10 border border-primary rounded-full text-sm font-medium text-primary flex items-center gap-2"
              >
                {item}
                <button
                  type="button"
                  onClick={() => onRemoveItem('responsibilities', item)}
                  className="hover:text-primary/70"
                >
                  x
                </button>
              </div>
            ))}
          </div>
          {errors.responsibilities && (
            <p className="text-xs text-red-600 mt-1">{errors.responsibilities}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
            Qualifications *
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add a qualification and press Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const input = e.currentTarget as HTMLInputElement
                  onAddItem('qualifications', input.value)
                  input.value = ''
                }
              }}
              className="flex-1 p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {data.qualifications.map((item) => (
              <div
                key={item}
                className="px-3 py-1.5 bg-primary/10 border border-primary rounded-full text-sm font-medium text-primary flex items-center gap-2"
              >
                {item}
                <button
                  type="button"
                  onClick={() => onRemoveItem('qualifications', item)}
                  className="hover:text-primary/70"
                >
                  x
                </button>
              </div>
            ))}
          </div>
          {errors.qualifications && (
            <p className="text-xs text-red-600 mt-1">{errors.qualifications}</p>
          )}
        </div>
      </div>
    </div>
  )
}
