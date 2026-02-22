'use client'

import { useState } from 'react'

export default function JobAlerts() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setEmail('')
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20 p-6">
      <h4 className="text-primary font-bold mb-2">Job Alerts</h4>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
        Get notified about new roles matching your profile.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full text-xs rounded-lg border border-[#cfdbe7] dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white px-3 py-2 outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-colors"
        >
          {submitted ? 'Enabled!' : 'Enable Alerts'}
        </button>
      </form>
    </div>
  )
}