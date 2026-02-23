interface FormData {
  fullName: string
  email: string
  phoneNumber: string
  currentLocation: string
}

interface Step1FormProps {
  data: FormData
  onChange: (field: string, value: string) => void
}

export default function Step1Form({ data, onChange }: Step1FormProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#111418] dark:text-white">
        Personal Information
      </h2>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            placeholder="Your full name"
            className="w-full p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
            Email *
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="your.email@example.com"
            className="w-full p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={data.phoneNumber}
            onChange={(e) => onChange('phoneNumber', e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="w-full p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
            Current Location
          </label>
          <input
            type="text"
            value={data.currentLocation}
            onChange={(e) => onChange('currentLocation', e.target.value)}
            placeholder="City, State/Country"
            className="w-full p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  )
}
