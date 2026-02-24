'use client';

import React, { useEffect, useState } from 'react';
import { X, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { handleGetJobByIdAsAdmin } from '@/lib/actions/admin/admin-actions';

interface ViewJobModalProps {
  jobId: string;
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to get display status
const getDisplayStatus = (status: string): string => {
  if (status === 'Active' || status === 'Inactive') {
    return status;
  }
  return 'Unknown';
};

// Helper function to get status color
const getStatusColor = (status: string): string => {
  const displayStatus = getDisplayStatus(status);
  if (displayStatus === 'Active') {
    return 'text-green-400';
  } else if (displayStatus === 'Inactive') {
    return 'text-red-400';
  } else {
    return 'text-slate-400';
  }
};

export default function ViewJobModal({ jobId, isOpen, onClose }: ViewJobModalProps) {
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await handleGetJobByIdAsAdmin(jobId);
        
        if (response.success) {
          setJob(response.data);
        } else {
          toast.error('Failed to fetch job details');
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        toast.error('Error fetching job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Job Details
          </h3>
          <button onClick={onClose} className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader className="w-6 h-6 text-violet-500 animate-spin" />
          </div>
        ) : job ? (
          <div className="space-y-6">
            {/* Job Header */}
            <div className="pb-6 border-b border-gray-200 dark:border-slate-800">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{job.jobTitle}</h2>
              <p className="text-lg text-gray-700 dark:text-slate-300">{job.companyName}</p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-slate-400 uppercase">Location</p>
                  <p className="text-gray-900 dark:text-white font-medium">{job.jobLocation}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-slate-400 uppercase">Job Type</p>
                  <p className="text-gray-900 dark:text-white font-medium">{job.jobType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-slate-400 uppercase">Experience Level</p>
                  <p className="text-gray-900 dark:text-white font-medium">{job.experienceLevel}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-slate-400 uppercase">Category</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {typeof job.jobCategory === 'string' ? job.jobCategory : job.jobCategory?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className={`font-medium ${getStatusColor(job.status)}`}>
                    {getDisplayStatus(job.status)}
                  </p>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Job Description</h3>
              <p className="text-gray-700 dark:text-slate-300 whitespace-pre-wrap">{job.jobDescription}</p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Responsibilities</h3>
                <ul className="list-disc list-inside space-y-2">
                  {job.responsibilities.map((resp: string, index: number) => (
                    <li key={index} className="text-gray-700 dark:text-slate-300">{resp}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Qualifications */}
            {job.qualifications && job.qualifications.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Qualifications</h3>
                <ul className="list-disc list-inside space-y-2">
                  {job.qualifications.map((qual: string, index: number) => (
                    <li key={index} className="text-gray-700 dark:text-slate-300">{qual}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {job.tags && job.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Deadline & Metadata */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-slate-800">
              <div>
                <p className="text-xs text-gray-600 dark:text-slate-400 uppercase">Application Deadline</p>
                <p className="text-gray-900 dark:text-white font-medium">{job.applicationDeadline || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-slate-400 uppercase">Posted Date</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {new Date(job.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-slate-400 uppercase">Applications</p>
                <p className="text-gray-900 dark:text-white font-medium">{job.applicationCount || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-slate-400 uppercase">Posted By</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {job.employerId?.companyName || 'N/A'}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-slate-800">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-slate-400">Failed to load job details</p>
        )}
      </div>
    </div>
  );
}
