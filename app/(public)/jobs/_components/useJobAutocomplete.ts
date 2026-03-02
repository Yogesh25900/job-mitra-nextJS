'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { searchJobs } from '@/lib/api/job'

export interface JobSuggestion {
  _id: string
  jobTitle: string
}

interface UseJobAutocompleteResult {
  suggestions: JobSuggestion[]
  isLoading: boolean
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const DEBOUNCE_DELAY = 400
const MAX_SUGGESTIONS = 8

export const useJobAutocomplete = (query: string): UseJobAutocompleteResult => {
  const [suggestions, setSuggestions] = useState<JobSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const normalizedQuery = useMemo(() => query.trim(), [query])

  const closeModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  const openModal = useCallback(() => {
    if (normalizedQuery.length > 0) {
      setIsOpen(true)
    }
  }, [normalizedQuery.length])

  useEffect(() => {
    if (!normalizedQuery) {
      setSuggestions([])
      setIsLoading(false)
      setIsOpen(false)
      return
    }

    setIsOpen(true)
    setIsLoading(true)

    let isMounted = true
    const controller = new AbortController()

    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await searchJobs(
          { jobTitle: normalizedQuery },
          1,
          MAX_SUGGESTIONS,
          controller.signal,
        )

        if (!isMounted) return

        if (response?.success && Array.isArray(response?.data)) {
          const mappedSuggestions: JobSuggestion[] = response.data
            .filter((job: any) => job?._id && job?.jobTitle)
            .map((job: any) => ({
              _id: String(job._id),
              jobTitle: String(job.jobTitle),
            }))

          setSuggestions(mappedSuggestions)
        } else {
          setSuggestions([])
        }
      } catch {
        if (isMounted) {
          setSuggestions([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }, DEBOUNCE_DELAY)

    return () => {
      isMounted = false
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [normalizedQuery])

  return {
    suggestions,
    isLoading,
    isOpen,
    openModal,
    closeModal,
  }
}
