'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { handleGetJobById } from '@/lib/actions/job-actions'
import { handleSubmitJobApplication } from '@/lib/actions/application-actions'
import Link from 'next/link'
import ProgressIndicator from './components/ProgressIndicator'
import Step1Form from './components/Step1Form'
import Step2Form from './components/Step2Form'
import Step3Form from './components/Step3Form'
import Step4Form from './components/Step4Form'
import SuccessScreen from './components/SuccessScreen'

interface BackendJob {
  _id: string;
  jobTitle: string;
  employerId?: string;
  companyName: string;
  jobLocation: string;
  jobType: string;
  experienceLevel: string;
  jobCategory: string;
  jobDescription: string;
  applicationDeadline?: string;
  responsibilities?: string[];
  qualifications?: string[];
  tags?: string[];
  companyProfilePicPath?: string;
  createdAt: string;
}

export default function ApplyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const jobId = searchParams.get('jobId')
  
  const [job, setJob] = useState<BackendJob | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    currentLocation: '',
    currentJobTitle: '',
    yearsOfExperience: '',
    currentCompany: '',
    noticePeriod: '',
    expectedSalary: '',
    keySkills: [] as string[],
    highestQualification: '',
    relevantCertifications: [] as string[],
    coverLetter: '',
    portfolioUrl: '',
    linkedinUrl: '',
    githubUrl: '',
  })

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) {
        setLoading(false)
        return
      }
      
      try {
        const result = await handleGetJobById(jobId)
        if (result.success && result.data) {
          setJob(result.data)
        }
      } catch (error) {
        console.error('Error fetching job:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [jobId])

  const handleFormChange = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddSkill = (skill: string) => {
    if (skill.trim() && !formData.keySkills.includes(skill.trim())) {
      setFormData(prev => ({
        ...prev,
        keySkills: [...prev.keySkills, skill.trim()],
      }))
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      keySkills: prev.keySkills.filter(s => s !== skill),
    }))
  }

  const handleAddCertification = (cert: string) => {
    if (cert.trim() && !formData.relevantCertifications.includes(cert.trim())) {
      setFormData(prev => ({
        ...prev,
        relevantCertifications: [...prev.relevantCertifications, cert.trim()],
      }))
    }
  }

  const handleRemoveCertification = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      relevantCertifications: prev.relevantCertifications.filter(c => c !== cert),
    }))
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.fullName.trim() || !formData.email.trim() || !formData.phoneNumber.trim()) {
        toast.error('Please fill in all required fields')
        return
      }
    }
    if (currentStep === 2) {
      if (!formData.currentJobTitle.trim() || !formData.yearsOfExperience) {
        toast.error('Please fill in all required fields')
        return
      }
    }
    if (currentStep === 3) {
      if (!resumeFile || !coverLetterFile) {
        toast.error('Please upload both resume and cover letter')
        return
      }
    }
    setCurrentStep(prev => prev + 1)
  }

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async () => {
    if (!coverLetterFile) {
      toast.error('Please upload your cover letter')
      return
    }

    if (!resumeFile) {
      toast.error('Please upload your resume')
      return
    }

    if (!job?._id) {
      toast.error('Job information is missing')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await handleSubmitJobApplication(
        {
          jobId: job._id,
          employerId: job.employerId || '',
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          currentLocation: formData.currentLocation,
          currentJobTitle: formData.currentJobTitle,
          yearsOfExperience: parseInt(formData.yearsOfExperience),
          currentCompany: formData.currentCompany,
          noticePeriod: formData.noticePeriod,
          expectedSalary: formData.expectedSalary || undefined,
          keySkills: formData.keySkills,
          highestQualification: formData.highestQualification,
          relevantCertifications: formData.relevantCertifications,
          portfolioUrl: formData.portfolioUrl || undefined,
          linkedinUrl: formData.linkedinUrl || undefined,
          githubUrl: formData.githubUrl || undefined,
        },
        resumeFile,
        coverLetterFile
      )

      console.log('🚀 [PAGE] Application submission result:', result)
      if (result.success) {
        toast.success(result.message || 'Application submitted successfully')
        setIsSuccess(true)
      } else {
        toast.error(result.message || 'Failed to submit application')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit application'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#1a242f] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-[#617589]">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#1a242f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#617589] mb-4">Job not found</p>
          <Link href="/jobs" className="text-primary hover:underline">
            Back to jobs
          </Link>
        </div>
      </div>
    )
  }

  // Success Screen
  if (isSuccess && job) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#1a242f] flex items-center justify-center p-4">
        <SuccessScreen job={job} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#1a242f] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/jobs"
            className="text-primary hover:underline text-sm font-semibold mb-4 inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Jobs
          </Link>
          <h1 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">
            Apply for {job.jobTitle}
          </h1>
          <p className="text-[#617589]">at {job.companyName}</p>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator currentStep={currentStep} totalSteps={4} />

        {/* Form Content */}
        <div className="bg-[#f6f7f8] dark:bg-slate-800 rounded-lg p-6 mb-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <Step1Form
              data={{
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                currentLocation: formData.currentLocation,
              }}
              onChange={handleFormChange}
            />
          )}

          {/* Step 2: Professional Details */}
          {currentStep === 2 && (
            <Step2Form
              data={{
                currentJobTitle: formData.currentJobTitle,
                yearsOfExperience: formData.yearsOfExperience,
                currentCompany: formData.currentCompany,
                noticePeriod: formData.noticePeriod,
                expectedSalary: formData.expectedSalary,
              }}
              onChange={handleFormChange}
            />
          )}

          {/* Step 3: Skills & Qualifications */}
          {currentStep === 3 && (
            <Step3Form
              data={{
                keySkills: formData.keySkills,
                highestQualification: formData.highestQualification,
                relevantCertifications: formData.relevantCertifications,
              }}
              onChange={handleFormChange}
              onAddSkill={handleAddSkill}
              onRemoveSkill={handleRemoveSkill}
              onAddCertification={handleAddCertification}
              onRemoveCertification={handleRemoveCertification}
              resumeFile={resumeFile}
              coverLetter={coverLetterFile}
              onResumeChange={setResumeFile}
              onCoverLetterChange={setCoverLetterFile}
            />
          )}

          {/* Step 4: Additional Information */}
          {currentStep === 4 && (
            <Step4Form
              data={{
                portfolioUrl: formData.portfolioUrl,
                linkedinUrl: formData.linkedinUrl,
                githubUrl: formData.githubUrl,
              }}
              onChange={handleFormChange}
            />
          )}


        </div>

        {/* Navigation Buttons */}
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
          
          {currentStep < 4 ? (
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
                  Submitting...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">check</span>
                  Submit Application
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
