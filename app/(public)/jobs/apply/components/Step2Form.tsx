interface FormData {
  currentJobTitle: string
  yearsOfExperience: string
  currentCompany: string
  noticePeriod: string
  expectedSalary: string
}

interface Step2FormProps {
  data: FormData
  onChange: (field: string, value: string) => void
}

export default function Step2Form({ data, onChange }: Step2FormProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#111418] dark:text-white">
        Professional Details
      </h2>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
            Current Job Title *
          </label>
          <input
            type="text"
            value={data.currentJobTitle}
            onChange={(e) => onChange('currentJobTitle', e.target.value)}
            placeholder="e.g., Senior Developer"
            className="w-full p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
            Years of Experience *
          </label>
          <select
            value={data.yearsOfExperience}
            onChange={(e) => onChange('yearsOfExperience', e.target.value)}
            className="w-full p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select years of experience</option>
            <option value="0">0-1 years</option>
            <option value="1">1-2 years</option>
            <option value="2">2-3 years</option>
            <option value="3">3-5 years</option>
            <option value="5">5-8 years</option>
            <option value="8">8-10 years</option>
            <option value="10">10+ years</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
            Current Company
          </label>
          <input
            type="text"
            value={data.currentCompany}
            onChange={(e) => onChange('currentCompany', e.target.value)}
            placeholder="Company name"
            className="w-full p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
            Notice Period
          </label>
          <select
            value={data.noticePeriod}
            onChange={(e) => onChange('noticePeriod', e.target.value)}
            className="w-full p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select notice period</option>
            <option value="Immediate">Immediate</option>
            <option value="2 weeks">2 weeks</option>
            <option value="1 month">1 month</option>
            <option value="2 months">2 months</option>
            <option value="3 months">3 months</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
            Expected Salary
          </label>
          <input
            type="text"
            value={data.expectedSalary}
            onChange={(e) => onChange('expectedSalary', e.target.value)}
            placeholder="e.g., 80,000 - 100,000"
            className="w-full p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  )
}
