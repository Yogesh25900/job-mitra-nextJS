'use client'

import { useState } from 'react'

interface FilterChip {
  id: string
  label: string
}

const defaultFilters: FilterChip[] = [
  { id: 'fulltime', label: 'Full-time' },
  { id: 'remote', label: 'Remote' },
  { id: 'salary', label: 'Under $100k' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'design', label: 'Design' },
]

export default function FilterChips() {
  const [activeFilter, setActiveFilter] = useState('fulltime')

  return (
    <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
      {defaultFilters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-5 transition-colors ${
            activeFilter === filter.id
              ? 'bg-primary text-white'
              : 'bg-white dark:bg-slate-800 border border-[#e7edf3] dark:border-slate-700 text-[#0d141b] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
          } shadow-sm`}
        >
          <span className="text-sm font-semibold">{filter.label}</span>
          <span className="material-symbols-outlined text-sm">expand_more</span>
        </button>
      ))}
    </div>
  )
}