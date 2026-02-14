'use client'

import ApplicationsManagement from './ApplicationsManagement'

export default function ApplicationsSection() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Your Applications
        </h2>
      </div>
      <ApplicationsManagement />
    </section>
  )
}