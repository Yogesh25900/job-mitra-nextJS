'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import ProgressIndicator from './ProgressIndicator'
import StepJobDetails from './StepJobDetails'
import StepResponsibilities from './StepResponsibilities'
import StepApplication from './StepApplication'
import StepReview from './StepReview'
import { createJob, updateJob } from '@/lib/api/job'
import { getAllCategories, Category } from '@/lib/api/category'

export interface JobFormData {
  jobTitle: string
  companyName: string
  jobLocation: string
  jobType: string
  jobCategory: string // ObjectId or empty string
  experienceLevel: string
  jobDescription: string
  responsibilities: string[]
  qualifications: string[]
  tags: string[]
  applicationDeadline: string
  status: 'Active' | 'Inactive' | 'Closed'
}

interface JobFormWizardProps {
  mode: 'create' | 'edit'
  initialData?: Partial<JobFormData>
  jobId?: string
  onSuccess?: (jobId?: string) => void
}

const TOTAL_STEPS = 4

const DEFAULT_FORM_DATA: JobFormData = {
  jobTitle: '',
  companyName: '',
  jobLocation: '',
  jobType: '',
  jobCategory: '',
  experienceLevel: '',
  jobDescription: '',
  responsibilities: [],
  qualifications: [],
  tags: [],
  applicationDeadline: '',
  status: 'Active',
}

export default function JobFormWizard({
  mode,
  initialData,
  jobId,
  onSuccess,
}: JobFormWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<JobFormData>(DEFAULT_FORM_DATA)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  const isEditMode = mode === 'edit'

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        const response = await getAllCategories()
        if (response.success && response.data) {
          setCategories(response.data)
        } else {
          console.error('Failed to load categories:', response.message)
        }
      } catch (error) {
        console.error('Error loading categories:', error)
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    if (!initialData) {
      return
    }

    setFormData((prev) => ({
      ...prev,
      ...initialData,
      responsibilities: initialData.responsibilities || prev.responsibilities,
      qualifications: initialData.qualifications || prev.qualifications,
      tags: initialData.tags || prev.tags,
      status: (initialData.status as JobFormData['status']) || prev.status,
    }))
  }, [initialData])

  const payload = useMemo(() => {
    const normalizeList = (list: string[]) =>
      list.map((item) => item.trim()).filter((item) => item.length > 0)

    return {
      ...formData,
      responsibilities: normalizeList(formData.responsibilities),
      qualifications: normalizeList(formData.qualifications),
      tags: normalizeList(formData.tags),
    }
  }, [formData])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddListItem = (
    field: 'responsibilities' | 'qualifications',
    value: string
  ) => {
    const trimmed = value.trim()
    if (!trimmed) {
      return
    }

    setFormData((prev) => {
      if (prev[field].includes(trimmed)) {
        return prev
      }
      return {
        ...prev,
        [field]: [...prev[field], trimmed],
      }
    })
  }

  const handleRemoveListItem = (
    field: 'responsibilities' | 'qualifications',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== value),
    }))
  }

  const handleAddTag = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) {
      return
    }

    setFormData((prev) => {
      if (prev.tags.includes(trimmed)) {
        return prev
      }
      return {
        ...prev,
        tags: [...prev.tags, trimmed],
      }
    })
  }

  const handleRemoveTag = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((item) => item !== value),
    }))
  }

  const validateStep = (step: number) => {
    const nextErrors: Record<string, string> = {}

    if (step === 1) {
      if (!payload.jobTitle) {
        nextErrors.jobTitle = 'Job title is required'
      }
      if (!payload.jobLocation) {
        nextErrors.jobLocation = 'Job location is required'
      }
      if (!payload.jobType) {
        nextErrors.jobType = 'Job type is required'
      }
      if (!payload.jobCategory) {
        nextErrors.jobCategory = 'Job category is required'
      }
      if (!payload.experienceLevel) {
        nextErrors.experienceLevel = 'Experience level is required'
      }
    }

    if (step === 2) {
      if (!payload.jobDescription || payload.jobDescription.length < 10) {
        nextErrors.jobDescription = 'Please add at least 10 characters'
      }
      if (payload.responsibilities.length === 0) {
        nextErrors.responsibilities = 'Add at least one responsibility'
      }
      if (payload.qualifications.length === 0) {
        nextErrors.qualifications = 'Add at least one qualification'
      }
    }

    if (step === 3) {
      if (!payload.companyName) {
        nextErrors.companyName = 'Company name is required'
      }
      if (!payload.applicationDeadline) {
        nextErrors.applicationDeadline = 'Application deadline is required'
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleNextStep = () => {
    if (!validateStep(currentStep)) {
      toast.error('Please complete the required fields')
      return
    }
    setCurrentStep((prev) => prev + 1)
  }

  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleReset = () => {
    setFormData(DEFAULT_FORM_DATA)
    setErrors({})
    setCurrentStep(1)
    setIsSuccess(false)
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      toast.error('Please complete the required fields')
      return
    }

    setIsSubmitting(true)

    try {
      const response = isEditMode
        ? await updateJob(jobId || '', payload)
        : await createJob(payload)

      if (response.success) {
        toast.success(response.message || 'Job saved successfully')
        setIsSuccess(true)
        onSuccess?.(response.data?._id)
      } else {
        toast.error(response.message || 'Failed to save job')
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save job')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="rounded-xl border border-[#e7edf3] dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-sm">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
          <span className="material-symbols-outlined">check</span>
        </div>
        <h2 className="text-2xl font-bold text-[#111418] dark:text-white mt-4">
          Job {isEditMode ? 'updated' : 'created'} successfully
        </h2>
        <p className="text-[#617589] mt-2">
          Your job posting is ready to attract great candidates.
        </p>
        <div className="flex flex-col md:flex-row gap-3 mt-6">
          <button
            onClick={() => router.push('/employer')}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Back to job list
          </button>
          {!isEditMode && (
            <button
              onClick={handleReset}
              className="flex-1 border border-[#f0f2f4] dark:border-slate-600 text-[#111418] dark:text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#f6f7f8] dark:hover:bg-slate-800 transition-colors"
            >
              Create another job
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <ProgressIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

      <div className="bg-[#f6f7f8] dark:bg-slate-800 rounded-lg p-6 mb-6">
        {currentStep === 1 && (
          <StepJobDetails
            data={{
              jobTitle: formData.jobTitle,
              jobLocation: formData.jobLocation,
              jobType: formData.jobType,
              jobCategory: formData.jobCategory,
              experienceLevel: formData.experienceLevel,
            }}
            errors={errors}
            onChange={handleChange}
            categories={categories}
            loadingCategories={loadingCategories}
          />
        )}

        {currentStep === 2 && (
          <StepResponsibilities
            data={{
              jobDescription: formData.jobDescription,
              responsibilities: formData.responsibilities,
              qualifications: formData.qualifications,
            }}
            errors={errors}
            onChange={handleChange}
            onAddItem={handleAddListItem}
            onRemoveItem={handleRemoveListItem}
          />
        )}

        {currentStep === 3 && (
          <StepApplication
            data={{
              companyName: formData.companyName,
              applicationDeadline: formData.applicationDeadline,
              tags: formData.tags,
              status: formData.status,
            }}
            errors={errors}
            onChange={handleChange}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
          />
        )}

        {currentStep === 4 && <StepReview data={payload} categories={categories} />}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handlePreviousStep}
          disabled={currentStep === 1}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
            currentStep === 1
              ? 'bg-[#f0f2f4] dark:bg-slate-700 text-[#617589] cursor-not-allowed'
              : 'border border-[#f0f2f4] dark:border-slate-600 text-[#111418] dark:text-white hover:bg-[#f6f7f8] dark:hover:bg-slate-800'
          }`}
        >
          Previous
        </button>

        {currentStep < TOTAL_STEPS ? (
          <button
            onClick={handleNextStep}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">check</span>
                {isEditMode ? 'Update Job' : 'Create Job'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
