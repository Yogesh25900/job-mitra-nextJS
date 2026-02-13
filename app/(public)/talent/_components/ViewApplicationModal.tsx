"use client"

import { X, Download, ExternalLink } from 'lucide-react'
import type { JobApplication } from '@/lib/types/application'

interface ViewApplicationModalProps {
  application: JobApplication
  isOpen: boolean
  onClose: () => void
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export default function ViewApplicationModal({ application, isOpen, onClose }: ViewApplicationModalProps) {
  if (!isOpen) return null

  // Extract job details from populated jobId
  const jobDetails = typeof application.jobId === 'object' ? application.jobId : null
  const jobTitle = jobDetails?.jobTitle || 'Job Application'
  const companyName = jobDetails?.companyName || 'Unknown Company'
  const jobLocation = jobDetails?.jobLocation || 'N/A'
  const jobType = jobDetails?.jobType || 'N/A'

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'Shortlisted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
      case 'Reviewing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case 'Pending':
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDownload = (filePath?: string, fileName: string = 'document') => {
    if (!filePath) return
    const fileUrl = `${BACKEND_URL}/profile_pictures/${filePath}`
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = fileName
    link.click()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#d0d8e0] dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#0d141b] dark:text-white">Application Details</h2>
            <p className="text-[#617589] dark:text-gray-400 mt-1">
              {jobTitle} at {companyName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#f6f7f8] dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-[#617589] dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Section */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#617589] dark:text-gray-400 mb-2">Application Status</p>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(application.status)}`}>
                {application.status}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#617589] dark:text-gray-400 mb-1">Applied on</p>
              <p className="text-sm font-medium text-[#0d141b] dark:text-white">{formatDate(application.appliedAt)}</p>
            </div>
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-[#f6f7f8] dark:bg-slate-700/50 rounded-lg">
            <div>
              <p className="text-xs text-[#617589] dark:text-gray-400 uppercase tracking-wide mb-1">Job Title</p>
              <p className="text-sm font-semibold text-[#0d141b] dark:text-white">{jobTitle}</p>
            </div>
            <div>
              <p className="text-xs text-[#617589] dark:text-gray-400 uppercase tracking-wide mb-1">Company</p>
              <p className="text-sm font-semibold text-[#0d141b] dark:text-white">{companyName}</p>
            </div>
            <div>
              <p className="text-xs text-[#617589] dark:text-gray-400 uppercase tracking-wide mb-1">Location</p>
              <p className="text-sm font-semibold text-[#0d141b] dark:text-white">{jobLocation}</p>
            </div>
            <div>
              <p className="text-xs text-[#617589] dark:text-gray-400 uppercase tracking-wide mb-1">Job Type</p>
              <p className="text-sm font-semibold text-[#0d141b] dark:text-white">{jobType}</p>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-[#0d141b] dark:text-white mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4 space-y-4">
              <div>
                <p className="text-sm text-[#617589] dark:text-gray-400 mb-1">Full Name</p>
                <p className="text-sm font-medium text-[#0d141b] dark:text-white">{application.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-[#617589] dark:text-gray-400 mb-1">Email</p>
                <p className="text-sm font-medium text-[#0d141b] dark:text-white">{application.email}</p>
              </div>
              <div>
                <p className="text-sm text-[#617589] dark:text-gray-400 mb-1">Phone</p>
                <p className="text-sm font-medium text-[#0d141b] dark:text-white">{application.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm text-[#617589] dark:text-gray-400 mb-1">Location</p>
                <p className="text-sm font-medium text-[#0d141b] dark:text-white">{application.currentLocation}</p>
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div>
            <h3 className="text-lg font-semibold text-[#0d141b] dark:text-white mb-4">Professional Details</h3>
            <div className="grid grid-cols-2 gap-4 space-y-4">
              <div>
                <p className="text-sm text-[#617589] dark:text-gray-400 mb-1">Current Job Title</p>
                <p className="text-sm font-medium text-[#0d141b] dark:text-white">{application.currentJobTitle}</p>
              </div>
              <div>
                <p className="text-sm text-[#617589] dark:text-gray-400 mb-1">Years of Experience</p>
                <p className="text-sm font-medium text-[#0d141b] dark:text-white">{application.yearsOfExperience} years</p>
              </div>
              <div>
                <p className="text-sm text-[#617589] dark:text-gray-400 mb-1">Current Company</p>
                <p className="text-sm font-medium text-[#0d141b] dark:text-white">{application.currentCompany}</p>
              </div>
              <div>
                <p className="text-sm text-[#617589] dark:text-gray-400 mb-1">Notice Period</p>
                <p className="text-sm font-medium text-[#0d141b] dark:text-white">{application.noticePeriod}</p>
              </div>
              {application.expectedSalary && (
                <div>
                  <p className="text-sm text-[#617589] dark:text-gray-400 mb-1">Expected Salary</p>
                  <p className="text-sm font-medium text-[#0d141b] dark:text-white">{application.expectedSalary}</p>
                </div>
              )}
            </div>
          </div>

          {/* Skills & Qualifications */}
          <div>
            <h3 className="text-lg font-semibold text-[#0d141b] dark:text-white mb-4">Skills & Qualifications</h3>
            
            {/* Key Skills */}
            <div className="mb-4">
              <p className="text-sm text-[#617589] dark:text-gray-400 mb-2">Key Skills</p>
              <div className="flex flex-wrap gap-2">
                {application.keySkills && application.keySkills.length > 0 ? (
                  application.keySkills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-[#617589] dark:text-gray-400">Not provided</p>
                )}
              </div>
            </div>

            {/* Highest Qualification */}
            <div className="mb-4">
              <p className="text-sm text-[#617589] dark:text-gray-400 mb-1">Highest Qualification</p>
              <p className="text-sm font-medium text-[#0d141b] dark:text-white">{application.highestQualification}</p>
            </div>

            {/* Certifications */}
            {application.relevantCertifications && application.relevantCertifications.length > 0 && (
              <div>
                <p className="text-sm text-[#617589] dark:text-gray-400 mb-2">Relevant Certifications</p>
                <div className="flex flex-wrap gap-2">
                  {application.relevantCertifications.map((cert, idx) => (
                    <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Documents & Links */}
          <div>
            <h3 className="text-lg font-semibold text-[#0d141b] dark:text-white mb-4">Documents & Links</h3>
            <div className="space-y-3">
              {/* Resume */}
              <button
                onClick={() => handleDownload(application.resumePath, 'resume.pdf')}
                className="w-full flex items-center justify-between p-3 bg-[#f6f7f8] dark:bg-slate-700/50 hover:bg-[#e0e4e8] dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-lg text-blue-600 dark:text-blue-400">description</span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-[#0d141b] dark:text-white">Resume</p>
                    <p className="text-xs text-[#617589] dark:text-gray-400">Click to download</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-[#617589] dark:text-gray-400" />
              </button>

              {/* Cover Letter */}
              {application.coverLetterPath && (
                <button
                  onClick={() => handleDownload(application.coverLetterPath, 'cover-letter.pdf')}
                  className="w-full flex items-center justify-between p-3 bg-[#f6f7f8] dark:bg-slate-700/50 hover:bg-[#e0e4e8] dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-lg text-green-600 dark:text-green-400">mail</span>
                    <div className="text-left">
                      <p className="text-sm font-medium text-[#0d141b] dark:text-white">Cover Letter</p>
                      <p className="text-xs text-[#617589] dark:text-gray-400">Click to download</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-[#617589] dark:text-gray-400" />
                </button>
              )}

              {/* Portfolio Link */}
              {application.portfolioUrl && (
                <a
                  href={application.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-3 bg-[#f6f7f8] dark:bg-slate-700/50 hover:bg-[#e0e4e8] dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-lg text-purple-600 dark:text-purple-400">language</span>
                    <div className="text-left">
                      <p className="text-sm font-medium text-[#0d141b] dark:text-white">Portfolio</p>
                      <p className="text-xs text-[#617589] dark:text-gray-400">View portfolio</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#617589] dark:text-gray-400" />
                </a>
              )}

              {/* LinkedIn */}
              {application.linkedinUrl && (
                <a
                  href={application.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-3 bg-[#f6f7f8] dark:bg-slate-700/50 hover:bg-[#e0e4e8] dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-lg text-blue-600 dark:text-blue-400">person</span>
                    <div className="text-left">
                      <p className="text-sm font-medium text-[#0d141b] dark:text-white">LinkedIn Profile</p>
                      <p className="text-xs text-[#617589] dark:text-gray-400">View LinkedIn</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#617589] dark:text-gray-400" />
                </a>
              )}

              {/* GitHub */}
              {application.githubUrl && (
                <a
                  href={application.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-3 bg-[#f6f7f8] dark:bg-slate-700/50 hover:bg-[#e0e4e8] dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-lg text-gray-600 dark:text-gray-400">code</span>
                    <div className="text-left">
                      <p className="text-sm font-medium text-[#0d141b] dark:text-white">GitHub Profile</p>
                      <p className="text-xs text-[#617589] dark:text-gray-400">View GitHub</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#617589] dark:text-gray-400" />
                </a>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="p-4 bg-[#f6f7f8] dark:bg-slate-700/50 rounded-lg">
            <p className="text-sm text-[#617589] dark:text-gray-400 mb-2">Last Updated</p>
            <p className="text-sm font-medium text-[#0d141b] dark:text-white">{formatDate(application.updatedAt)}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#d0d8e0] dark:border-slate-700 sticky bottom-0 bg-white dark:bg-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#f6f7f8] dark:bg-slate-700 text-[#111418] dark:text-white rounded-lg font-semibold hover:bg-[#e0e4e8] dark:hover:bg-slate-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
