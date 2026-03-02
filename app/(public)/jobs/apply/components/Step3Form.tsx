interface FormData {
  keySkills: string[]
  highestQualification: string
  relevantCertifications: string[]
}

interface Step3FormProps {
  data: FormData
  onChange: (field: string, value: string | string[]) => void
  onAddSkill: (skill: string) => void
  onRemoveSkill: (skill: string) => void
  onAddCertification: (cert: string) => void
  onRemoveCertification: (cert: string) => void
  resumeFile: File | null
  coverLetter:File | null
  onResumeChange: (file: File | null) => void
  onCoverLetterChange: (file: File | null) => void
}

export default function Step3Form({
  data,
  onChange,
  onAddSkill,
  onRemoveSkill,
  onAddCertification,
  onRemoveCertification,
  resumeFile,
  coverLetter,
  onCoverLetterChange,
  onResumeChange,
}: Step3FormProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#111418] dark:text-white">
        Skills, Qualifications & Cover Letter
      </h2>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
            Key Skills
          </label>
          <div className="flex gap-2 mb-2">
            <input
              id="skillInput"
              type="text"
              placeholder="Add a skill and press Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const input = e.currentTarget as HTMLInputElement
                  onAddSkill(input.value)
                  input.value = ''
                }
              }}
              className="flex-1 p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {data.keySkills.map((skill) => (
              <div
                key={skill}
                className="px-3 py-1.5 bg-primary/10 border border-primary rounded-full text-sm font-medium text-primary flex items-center gap-2"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => onRemoveSkill(skill)}
                  className="hover:text-primary/70"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
            Highest Qualification
          </label>
          <select
            value={data.highestQualification}
            onChange={(e) => onChange('highestQualification', e.target.value)}
            className="w-full p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select qualification</option>
            <option value="High School">High School</option>
            <option value="Diploma">Diploma</option>
            <option value="Bachelor's">Bachelor's Degree</option>
            <option value="Master's">Master's Degree</option>
            <option value="PhD">PhD</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
            Relevant Certifications
          </label>
          <div className="flex gap-2 mb-2">
            <input
              id="certInput"
              type="text"
              placeholder="Add a certification and press Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const input = e.currentTarget as HTMLInputElement
                  onAddCertification(input.value)
                  input.value = ''
                }
              }}
              className="flex-1 p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {data.relevantCertifications.map((cert) => (
              <div
                key={cert}
                className="px-3 py-1.5 bg-primary/10 border border-primary rounded-full text-sm font-medium text-primary flex items-center gap-2"
              >
                {cert}
                <button
                  type="button"
                  onClick={() => onRemoveCertification(cert)}
                  className="hover:text-primary/70"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
            Resume (PDF, DOC, DOCX) *
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => onResumeChange(e.target.files?.[0] || null)}
            className="w-full p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {resumeFile && (
            <p className="text-xs text-primary mt-1">
              Selected: {resumeFile.name}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold text-[#111418] dark:text-white block mb-2">
            Cover Letter *
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => onCoverLetterChange(e.target.files?.[0] || null)}
            placeholder="Tell us why you're interested in this role and what makes you a great fit..."
            className="w-full p-3 border border-[#f0f2f4] dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary min-h-40"
          />
          <span className="text-xs text-[#617589] block mt-1">
            {coverLetter?.name || "No file selected"}
          </span>
        </div>
      </div>
    </div>
  )
}
