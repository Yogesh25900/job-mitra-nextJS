interface StepApplicationProps {
  data: {
    companyName: string
    applicationDeadline: string
    tags: string[]
    status: string
  }
  errors: Record<string, string>
  onChange: (field: string, value: string) => void
  onAddTag: (value: string) => void
  onRemoveTag: (value: string) => void
}

export default function StepApplication({
  data,
  errors,
  onChange,
  onAddTag,
  onRemoveTag,
}: StepApplicationProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#111418] dark:text-white">
        Application and Deadline
      </h2>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
            Company Name *
          </label>
          <input
            type="text"
            value={data.companyName}
            onChange={(e) => onChange('companyName', e.target.value)}
            placeholder="Your company name"
            className="w-full p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.companyName && (
            <p className="text-xs text-red-600 mt-1">{errors.companyName}</p>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
              Application Deadline *
            </label>
            <input
              type="date"
              value={data.applicationDeadline}
              onChange={(e) => onChange('applicationDeadline', e.target.value)}
              className="w-full p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.applicationDeadline && (
              <p className="text-xs text-red-600 mt-1">{errors.applicationDeadline}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
              Job Status
            </label>
            <select
              value={data.status}
              onChange={(e) => onChange('status', e.target.value)}
              className="w-full p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add a tag and press Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const input = e.currentTarget as HTMLInputElement
                  onAddTag(input.value)
                  input.value = ''
                }
              }}
              className="flex-1 p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {data.tags.map((item) => (
              <div
                key={item}
                className="px-3 py-1.5 bg-primary/10 border border-primary rounded-full text-sm font-medium text-primary flex items-center gap-2"
              >
                {item}
                <button
                  type="button"
                  onClick={() => onRemoveTag(item)}
                  className="hover:text-primary/70"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
