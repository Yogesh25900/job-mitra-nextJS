'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useJobAutocomplete } from './useJobAutocomplete'
import { handleGetAllCategories } from '@/lib/actions/category-actions'

// Category type
interface Category {
  _id: string;
  name: string;
}

export default function HeroSection() {
  const [jobSearch, setJobSearch] = useState('')
  const [locationSearch, setLocationSearch] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [categoriesError, setCategoriesError] = useState('')
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const router = useRouter()
  const { suggestions, isLoading, isOpen, openModal, closeModal } = useJobAutocomplete(jobSearch)

  // Fetch categories using server action
  useEffect(() => {
    setCategoriesLoading(true)
    handleGetAllCategories()
      .then((result) => {
        if (result.success) {
          setCategories(result.data || [])
        } else {
          setCategoriesError(result.message || 'Could not load categories')
        }
        setCategoriesLoading(false)
      })
      .catch((err) => {
        setCategoriesError('Could not load categories')
        setCategoriesLoading(false)
      })
  }, [])

  const hasQuery = useMemo(() => jobSearch.trim().length > 0, [jobSearch])


  // Debounced category/location search logic (not jobSearch)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (locationSearch.trim()) params.append('location', locationSearch);
      if (category && category !== 'all') params.append('jobCategory', category);
      router.push(`/jobs?${params.toString()}`);
    }, 400);
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationSearch, category]);

  const handleClearSearch = () => {
    setJobSearch('')
    setLocationSearch('')
    setCategory('')
    setActiveIndex(-1)
    closeModal()
  }

  const handleSuggestionSelect = (jobId: string) => {
    closeModal();
    setActiveIndex(-1);
    router.push(`/jobs/details/${jobId}`);
  };

  const handleJobInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || (!isLoading && suggestions.length === 0)) {
      if (e.key === 'Escape') {
        closeModal()
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => {
        if (suggestions.length === 0) return -1
        return prev < suggestions.length - 1 ? prev + 1 : 0
      })
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => {
        if (suggestions.length === 0) return -1
        return prev > 0 ? prev - 1 : suggestions.length - 1
      })
      return
    }

    if (e.key === 'Enter' && activeIndex >= 0 && suggestions[activeIndex]) {
      e.preventDefault()
      handleSuggestionSelect(suggestions[activeIndex]._id)
      return
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      closeModal()
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setActiveIndex(-1)
      return
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal()
      }
    }

    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [isOpen, closeModal])

  return (
    <section className="relative bg-white dark:bg-slate-900/50 py-12 px-4 border-b border-[#e7edf3] dark:border-slate-800">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-[#0d141b] dark:text-white text-4xl md:text-5xl font-extrabold leading-tight tracking-[-0.033em]">
            Find your next career move
          </h1>
          <p className="text-[#4c739a] dark:text-slate-400 text-lg max-w-[600px] mx-auto">
            Search thousands of job openings from top-tier companies globally.
          </p>
        </div>

        {/* Multi-input Search Bar */}
        <form className="w-full max-w-[800px] flex flex-col md:flex-row items-stretch bg-white dark:bg-slate-800 border border-[#cfdbe7] dark:border-slate-700 rounded-xl shadow-sm overflow-hidden p-2 gap-2">
          <div className="flex flex-1 items-center px-3 border-b md:border-b-0 md:border-r border-[#cfdbe7] dark:border-slate-700">
            <span className="material-symbols-outlined text-[#4c739a] mr-2">
              search
            </span>
            <input
              type="text"
              placeholder="Search roles"
              value={jobSearch}
              onChange={(e) => setJobSearch(e.target.value)}
              onFocus={() => {
                if (hasQuery) {
                  openModal();
                }
              }}
              onKeyDown={handleJobInputKeyDown}
              aria-autocomplete="list"
              aria-expanded={isOpen}
              aria-controls="job-search-suggestions"
              aria-activedescendant={activeIndex >= 0 ? `job-suggestion-${activeIndex}` : undefined}
              className="w-full bg-transparent border-none focus:ring-0 text-sm md:text-base py-3 dark:text-white placeholder:text-[#4c739a] outline-none"
            />
          </div>

       
          <div className="flex gap-2">
            {(jobSearch || locationSearch) && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="border border-[#cfdbe7] dark:border-slate-700 text-[#111418] dark:text-white font-bold px-6 py-3 rounded-lg hover:bg-[#f6f7f8] dark:hover:bg-slate-700 transition-all active:scale-95"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Dropdown - Redesigned, no icon */}
          <div className="flex flex-1 items-center px-3 min-w-[180px]">
            {categoriesLoading ? (
              <select
                disabled
                className="w-full bg-transparent border-none text-sm md:text-base py-3 text-[#4c739a] dark:text-slate-400 dark:bg-slate-800 bg-white placeholder:text-[#4c739a] dark:placeholder:text-slate-400 focus:ring-0 outline-none"
              >
                <option>Loading...</option>
              </select>
            ) : categoriesError ? (
              <select
                disabled
                className="w-full bg-transparent border-none text-sm md:text-base py-3 text-[#ef4444] dark:text-red-400 dark:bg-slate-800 bg-white focus:ring-0 outline-none"
              >
                <option>{categoriesError}</option>
              </select>
            ) : (
              <select
                value={category || 'all'}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-sm md:text-base py-3 text-[#111418] dark:text-white dark:bg-slate-800 bg-white placeholder:text-[#4c739a] dark:placeholder:text-slate-400 outline-none appearance-none"
                aria-label="Filter by category"
                style={{ paddingLeft: '16px', paddingRight: '16px' }}
              >
                <option value="all" className="text-[#4c739a] dark:text-slate-400 py-2">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id} className="text-[#111418] dark:text-white bg-white dark:bg-slate-800 py-2">{cat.name}</option>
                ))}
              </select>
            )}
          </div>
        </form>
      </div>

      {isOpen && hasQuery && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={closeModal}
            aria-hidden="true"
          />
          
          {/* Dropdown results - positioned absolutely below search */}
          <div className="absolute left-1/2 -translate-x-1/2 z-50 w-full max-w-[800px] px-4 mt-2">
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Job search suggestions"
              className="w-full rounded-xl border border-[#cfdbe7] dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-h-[400px] overflow-y-auto" id="job-search-suggestions" role="listbox" aria-label="Job titles">
                {isLoading ? (
                  <div className="px-5 py-4 text-sm text-[#4c739a] dark:text-slate-400 text-left flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg animate-spin">refresh</span>
                    Loading jobs...
                  </div>
                ) : suggestions.length === 0 ? (
                  <div className="px-5 py-4 text-sm text-[#4c739a] dark:text-slate-400 text-left flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">search_off</span>
                    No jobs found.
                  </div>
                ) : (
                  <ul className="divide-y divide-[#e7edf3] dark:divide-slate-700">
                    {suggestions.map((job, index) => (
                      <li key={job._id}>
                        <button
                          id={`job-suggestion-${index}`}
                          type="button"
                          role="option"
                          aria-selected={activeIndex === index}
                          className={`w-full px-5 py-3 text-left text-sm font-medium transition-colors flex items-center gap-3 ${
                            activeIndex === index
                              ? 'bg-primary/10 text-primary'
                              : 'text-[#111418] dark:text-white hover:bg-[#f6f7f8] dark:hover:bg-slate-700/70'
                          }`}
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => handleSuggestionSelect(job._id)}
                        >
                          <span className="material-symbols-outlined text-[#4c739a] text-lg">work</span>
                          {job.jobTitle}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}