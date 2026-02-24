'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { handleCreateJobAsAdmin, handleGetAllCategories } from '@/lib/actions/admin/admin-actions';

interface CreateJobModalProps {
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

export default function CreateJobModal({ isOpen, onClose, onSuccess }: CreateJobModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    jobLocation: '',
    jobType: '',
    experienceLevel: '',
    jobCategory: '',
    jobDescription: '',
    applicationDeadline: '',
    status: 'Active',
    responsibilities: [''],
    qualifications: [''],
    tags: [''],
  });
  const [profilePic, setProfilePic] = useState<File | null>(null);

  // Fetch categories on modal open
  useEffect(() => {
    if (!isOpen) return;

    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await handleGetAllCategories();
        
        if (response.success && response.data) {
          setCategories(response.data);
        } else {
          toast.error(response.message || 'Failed to load categories');
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Error loading categories');
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
    }
  };

  const handleArrayInputChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).map((item: string, i: number) => i === index ? value : item),
    }));
  };

  const handleAddArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as string[]), ''],
    }));
  };

  const handleRemoveArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_: string, i: number) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.jobTitle || !formData.companyName || !formData.jobLocation || !formData.jobType || !formData.experienceLevel || !formData.jobDescription) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.jobCategory) {
      toast.error('Please select a job category');
      return;
    }

    try {
      setSubmitting(true);

      // Build FormData for submission
      const submitData = new FormData();
      submitData.append('jobTitle', formData.jobTitle);
      submitData.append('companyName', formData.companyName);
      submitData.append('jobLocation', formData.jobLocation);
      submitData.append('jobType', formData.jobType);
      submitData.append('experienceLevel', formData.experienceLevel);
      submitData.append('jobCategory', formData.jobCategory); // Send category ID
      submitData.append('jobDescription', formData.jobDescription);
      submitData.append('applicationDeadline', formData.applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      submitData.append('status', formData.status);

      // Add array fields
      formData.responsibilities.forEach((resp, index) => {
        if (resp.trim()) submitData.append(`responsibilities[${index}]`, resp);
      });
      formData.qualifications.forEach((qual, index) => {
        if (qual.trim()) submitData.append(`qualifications[${index}]`, qual);
      });
      formData.tags.forEach((tag, index) => {
        if (tag.trim()) submitData.append(`tags[${index}]`, tag);
      });

   

      const response = await handleCreateJobAsAdmin(submitData);

      if (response.success) {
        toast.success('Job created successfully');
        await onSuccess();
        onClose();
      } else {
        toast.error(response.message || 'Failed to create job');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Error creating job');
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
            Post New Job
          </h3>
          <button onClick={onClose} className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-400 mb-2">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              placeholder="e.g., Senior React Developer"
              className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Company Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="e.g., Tech Corp"
                className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="jobLocation"
                value={formData.jobLocation}
                onChange={handleInputChange}
                placeholder="e.g., San Francisco, CA"
                className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Job Type & Experience */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2">
                Job Type <span className="text-red-500">*</span>
              </label>
              <select
                name="jobType"
                value={formData.jobType}
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
              <label className="block text-sm font-semibold text-slate-400 mb-2">
                Experience Level <span className="text-red-500">*</span>
              </label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
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
            <label className="block text-sm font-semibold text-slate-400 mb-2">Job Category</label>
            <select
              name="jobCategory"
              value={formData.jobCategory}
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
              <p className="text-sm text-slate-400 mt-1 flex items-center gap-1">
                <Loader className="w-3 h-3 animate-spin" /> Loading categories...
              </p>
            )}
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleInputChange}
              placeholder="Provide a detailed job description..."
              rows={4}
              className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Application Deadline & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2">Application Deadline</label>
              <input
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
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
            <label className="block text-sm font-semibold text-slate-400 mb-2">Key Responsibilities</label>
            <div className="space-y-2">
              {formData.responsibilities.map((resp, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={resp}
                    onChange={(e) => handleArrayInputChange('responsibilities', index, e.target.value)}
                    placeholder={`Responsibility ${index + 1}`}
                    className="flex-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {formData.responsibilities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem('responsibilities', index)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleAddArrayItem('responsibilities')}
              className="mt-2 px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-lg transition-colors text-sm"
            >
              + Add Responsibility
            </button>
          </div>

          {/* Qualifications */}
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">Required Qualifications</label>
            <div className="space-y-2">
              {formData.qualifications.map((qual, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={qual}
                    onChange={(e) => handleArrayInputChange('qualifications', index, e.target.value)}
                    placeholder={`Qualification ${index + 1}`}
                    className="flex-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {formData.qualifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem('qualifications', index)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleAddArrayItem('qualifications')}
              className="mt-2 px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-lg transition-colors text-sm"
            >
              + Add Qualification
            </button>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">Skill Tags</label>
            <div className="space-y-2">
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleArrayInputChange('tags', index, e.target.value)}
                    placeholder={`Skill ${index + 1}`}
                    className="flex-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {formData.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem('tags', index)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleAddArrayItem('tags')}
              className="mt-2 px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-lg transition-colors text-sm"
            >
              + Add Skill Tag
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-slate-800">
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
              className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              {submitting && <Loader className="w-4 h-4 animate-spin" />}
              {submitting ? 'Creating...' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
