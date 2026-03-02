interface JobDescriptionProps {
  aboutRole: string[]
  responsibilities: string[]
  requirements: string[]
  techStack: string[]
}

export default function JobDescription({
  aboutRole,
  responsibilities,
  requirements,
  techStack,
}: JobDescriptionProps) {
  return (
    <div className="rounded-xl bg-surface-light dark:bg-surface-dark p-6 shadow-sm border border-slate-200 dark:border-slate-800/50 sm:p-8">
      {/* About the Role */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
          About the Role
        </h2>
        {aboutRole.map((paragraph, index) => (
          <p
            key={index}
            className={`text-base leading-relaxed text-slate-600 dark:text-slate-300 ${
              index > 0 ? 'mt-4' : ''
            }`}
          >
            {paragraph}
          </p>
        ))}
      </section>

      {/* What You'll Do */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
          What You'll Do
        </h2>
        <ul className="space-y-3">
          {responsibilities.map((responsibility, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-base text-slate-600 dark:text-slate-300"
            >
              <span className="material-symbols-outlined mt-0.5 text-primary shrink-0 text-[20px]">
                check_circle
              </span>
              <span>{responsibility}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* What You Bring */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
          What You Bring
        </h2>
        <ul className="space-y-3">
          {requirements.map((requirement, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-base text-slate-600 dark:text-slate-300"
            >
              <span className="material-symbols-outlined mt-0.5 text-primary shrink-0 text-[20px]">
                arrow_right_alt
              </span>
              <span>{requirement}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Tech Stack & Skills */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
          Tech Stack &amp; Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech, index) => (
            <span
              key={index}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}