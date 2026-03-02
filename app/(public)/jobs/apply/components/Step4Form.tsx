interface FormData {
  portfolioUrl: string
  linkedinUrl: string
  githubUrl: string
}

interface Step4FormProps {
  data: FormData
  onChange: (field: string, value: string) => void
}

export default function Step4Form({ data, onChange }: Step4FormProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#111418] dark:text-white">
        Additional Information
      </h2>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
            Portfolio URL
          </label>
          <input
            type="url"
            value={data.portfolioUrl}
            onChange={(e) => onChange('portfolioUrl', e.target.value)}
            placeholder="https://yourportfolio.com"
            className="w-full p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
            LinkedIn URL
          </label>
          <input
            type="url"
            value={data.linkedinUrl}
            onChange={(e) => onChange('linkedinUrl', e.target.value)}
            placeholder="https://linkedin.com/in/yourprofile"
            className="w-full p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
            GitHub URL
          </label>
          <input
            type="url"
            value={data.githubUrl}
            onChange={(e) => onChange('githubUrl', e.target.value)}
            placeholder="https://github.com/yourprofile"
            className="w-full p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  )
}
