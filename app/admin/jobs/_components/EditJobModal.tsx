'use client';

import React, { useEffect, useState } from 'react';
import { X, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { handleGetJobByIdAsAdmin, handleUpdateJobByIdAsAdmin, handleGetAllCategories } from '@/lib/actions/admin/admin-actions';

interface EditJobModalProps {
  jobId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

interface Category {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
}

export default function EditJobModal({ jobId, isOpen, onClose, onSuccess }: EditJobModalProps) {
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch job data
        const jobResponse = await handleGetJobByIdAsAdmin(jobId);
        
        if (jobResponse.success) {
          setJob(jobResponse.data);
          // Get the category ID (handle both populated and unpopulated cases)
          const categoryId = jobResponse.data.jobCategory?._id || jobResponse.data.jobCategory;
          
          setFormData({
            jobTitle: jobResponse.data.jobTitle,
            companyName: jobResponse.data.companyName,
            jobLocation: jobResponse.data.jobLocation,
            jobType: jobResponse.data.jobType,
            experienceLevel: jobResponse.data.experienceLevel,
            jobCategory: categoryId || '',
            jobDescription: jobResponse.data.jobDescription,
            applicationDeadline: jobResponse.data.applicationDeadline,
            status: jobResponse.data.status,
            responsibilities: jobResponse.data.responsibilities || [],
            qualifications: jobResponse.data.qualifications || [],
            tags: jobResponse.data.tags || [],
          });
        } else {
          toast.error('Failed to fetch job details');
        }
        
        // Fetch categories
        setLoadingCategories(true);
        const categoriesResponse = await handleGetAllCategories();
        
        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        } else {
          console.error('Failed to load categories:', categoriesResponse.message);
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error fetching job details');
      } finally {
        setLoading(false);
        setLoadingCategories(false);
      }
    };

    fetchData();
  }, [jobId, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayInputChange = (field: string, index: number, value: string) => {
    setFormData((prev: { [x: string]: string[]; }) => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => i === index ? value : item),
    }));
  };

  const handleAddArrayItem = (field: string) => {
    setFormData((prev: { [x: string]: any; }) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const handleRemoveArrayItem = (field: string, index: number) => {
    setFormData((prev: { [x: string]: any[]; }) => ({
      ...prev,
      [field]: prev[field].filter((_: string, i: number) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      const response = await handleUpdateJobByIdAsAdmin(jobId, formData);

      if (response.success) {
        toast.success('Job updated successfully');
        await onSuccess();
        onClose();
      } else {
        toast.error(response.message || 'Failed to update job');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Error updating job');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Job
          </h3>
          <button onClick={onClose} className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader className="w-6 h-6 text-violet-500 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-400 mb-2">Job Title</label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle || ''}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Company Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-400 mb-2">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName || ''}
                  onChange={handleInputChange}
                  className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-400 mb-2">Location</label>
                <input
                  type="text"
                  name="jobLocation"
                  value={formData.jobLocation || ''}
                  onChange={handleInputChange}
                  className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Job Type & Experience */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-400 mb-2">Job Type</label>
                <select
                  name="jobType"
                  value={formData.jobType || ''}
                  onChange={handleInputChange}
                  className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Job Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-400 mb-2">Experience Level</label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel || ''}
                  onChange={handleInputChange}
                  className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Experience Level</option>
                  <option value="Entry">Entry Level</option>
                  <option value="Mid">Mid Level</option>
                  <option value="Senior">Senior Level</option>
                </select>
              </div>
            </div>

            {/* Job Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-400 mb-2">Job Category</label>
              <select
                name="jobCategory"
                value={formData.jobCategory || ''}
                onChange={handleInputChange}
                disabled={loadingCategories || categories.length === 0}
                className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {loadingCategories ? 'Loading categories...' : 'Select a category'}
                </option>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  !loadingCategories && <option disabled>No categories available</option>
                )}
              </select>
              {loadingCategories && (
                <p className="text-sm text-gray-600 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <Loader className="w-3 h-3 animate-spin" /> Loading categories...
                </p>
              )}
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-400 mb-2">Job Description</label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Application Deadline & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-400 mb-2">Application Deadline</label>
                <input
                  type="text"
                  name="applicationDeadline"
                  value={formData.applicationDeadline || ''}
                  onChange={handleInputChange}
                  className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-400 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status || ''}
                  onChange={handleInputChange}
                  className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Responsibilities */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-400 mb-2">Responsibilities</label>
              <div className="space-y-2">
                {formData.responsibilities?.map((resp: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={resp}
                      onChange={(e) => handleArrayInputChange('responsibilities', index, e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem('responsibilities', index)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => handleAddArrayItem('responsibilities')}
                className="mt-2 px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-lg transition-colors"
              >
                Add Responsibility
              </button>
            </div>

            {/* Qualifications */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-400 mb-2">Qualifications</label>
              <div className="space-y-2">
                {formData.qualifications?.map((qual: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={qual}
                      onChange={(e) => handleArrayInputChange('qualifications', index, e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem('qualifications', index)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => handleAddArrayItem('qualifications')}
                className="mt-2 px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-lg transition-colors"
              >
                Add Qualification
              </button>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-400 mb-2">Tags</label>
              <div className="space-y-2">
                {formData.tags?.map((tag: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleArrayInputChange('tags', index, e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem('tags', index)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => handleAddArrayItem('tags')}
                className="mt-2 px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-lg transition-colors"
              >
                Add Tag
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {submitting ? 'Updating...' : 'Update Job'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
