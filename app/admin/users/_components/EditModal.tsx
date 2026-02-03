'use client';

import React, { useState, useEffect } from 'react';
import { Loader, Eye, EyeOff, X, Upload } from 'lucide-react';
import { handleGetUserByIdAsAdmin, handleUpdateUserByIdAsAdmin } from '@/lib/actions/admin/admin-actions';
import { toast } from 'react-hot-toast';
import { buildImageUrl } from '@/lib/utils/imageUrl';

interface User {
  _id: string;
  id?: string;
  name?: string;
  email: string;
  role: string;
  userRole: 'employer' | 'candidate';
  avatar?: string;
  // Employer fields
  companyName?: string;
  contactName?: string;
  phoneNumber?: string;
  // Candidate fields
  fname?: string;
  lname?: string;
  password?: string;
}

interface EditModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditModal({ userId, isOpen, onClose, onSuccess }: EditModalProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [formData, setFormData] = useState<User>({
    _id: '',
    email: '',
    role: 'user',
    userRole: 'candidate',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [originalEmail, setOriginalEmail] = useState('');

  // Fetch user data when modal opens
  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await handleGetUserByIdAsAdmin(userId);

        if (response.success) {
          const user = response.data;
          // Determine user role based on which fields are present
          const userRole = user.companyName ? 'employer' : 'candidate';

          setFormData({
            _id: user._id,
            id: user._id,
            email: user.email || '',
            role: user.role || 'user',
            userRole: userRole,
            avatar: user.avatar,
            // Employer fields
            companyName: user.companyName,
            contactName: user.contactName,
            phoneNumber: user.phoneNumber,
            // Candidate fields
            fname: user.fname,
            lname: user.lname,
          });
          setPreviewImage(buildImageUrl(user.avatar) || buildImageUrl(user.profilePicturePath) || null);
          setOriginalEmail(user.email || '');
        } else {
          toast.error(response.message || 'Failed to load user');
          onClose();
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Error loading user');
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isOpen, userId, onClose]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.userRole === 'employer') {
      if (!formData.companyName?.trim()) {
        newErrors.companyName = 'Company name is required';
      }
      if (!formData.contactName?.trim()) {
        newErrors.contactName = 'Contact name is required';
      }
    } else {
      if (!formData.fname?.trim()) {
        newErrors.fname = 'First name is required';
      }
      if (!formData.lname?.trim()) {
        newErrors.lname = 'Last name is required';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      const { _id, password, id, ...otherData } = formData;

      // Build update data based on user role
      const updateData: any = {
        email: formData.email,
        role: formData.role,
        userRole: formData.userRole,
      };

      // Add role-specific fields
      if (formData.userRole === 'employer') {
        updateData.companyName = formData.companyName;
        updateData.contactName = formData.contactName;
        updateData.phoneNumber = formData.phoneNumber;
      } else {
        updateData.fname = formData.fname;
        updateData.lname = formData.lname;
      }

      // Only include password if it was provided
      const dataToUpdate = password ? { ...updateData, password } : updateData;

      // If there's a new profile picture, convert to base64
      if (profilePicture) {
        const reader = new FileReader();
        reader.onload = async () => {
          const base64 = reader.result as string;
          const userDataWithImage = {
            ...dataToUpdate,
            profilePictureBase64: base64,
            profilePictureName: profilePicture.name,
          };

          const response = await handleUpdateUserByIdAsAdmin(userId, userDataWithImage);

          if (response.success) {
            toast.success('User updated successfully!');
            onSuccess?.();
            onClose();
          } else {
            toast.error(response.message || 'Failed to update user');
            setErrors({ submit: response.message || 'Failed to update user' });
          }
          setSubmitting(false);
        };
        reader.readAsDataURL(profilePicture);
      } else {
        const response = await handleUpdateUserByIdAsAdmin(userId, dataToUpdate);

        if (response.success) {
          toast.success('User updated successfully!');
          onSuccess?.();
          onClose();
        } else {
          toast.error(response.message || 'Failed to update user');
          setErrors({ submit: response.message || 'Failed to update user' });
        }
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error updating user');
      setErrors({ submit: 'Error updating user' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full p-6 flex items-center justify-center h-96">
          <Loader className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start md:items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full p-6 my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Edit User</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          {/* General Error */}
          {errors.submit && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">{errors.submit}</p>
            </div>
          )}

          {/* Profile Picture Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-white mb-2">Profile Picture</label>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <label className="flex-1 px-4 py-2.5 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">Click to upload or drag & drop</span>
              </label>
            </div>
          </div>

          {/* Role-specific Name Fields */}
          {formData.userRole === 'employer' ? (
            <>
              {/* Company Name Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-white mb-2">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName || ''}
                  onChange={handleChange}
                  placeholder="Company Name"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-slate-700 dark:text-white dark:border-slate-600 transition-colors ${errors.companyName ? 'border-red-500' : 'border-gray-200'
                    }`}
                />
                {errors.companyName && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.companyName}</p>}
              </div>

              {/* Contact Name Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-white mb-2">Contact Name</label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName || ''}
                  onChange={handleChange}
                  placeholder="Contact Person Name"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-slate-700 dark:text-white dark:border-slate-600 transition-colors ${errors.contactName ? 'border-red-500' : 'border-gray-200'
                    }`}
                />
                {errors.contactName && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.contactName}</p>}
              </div>

              {/* Phone Number Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-white mb-2">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber || ''}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-slate-700 dark:text-white dark:border-slate-600 transition-colors ${errors.phoneNumber ? 'border-red-500' : 'border-gray-200'
                    }`}
                />
                {errors.phoneNumber && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.phoneNumber}</p>}
              </div>
            </>
          ) : (
            <>
              {/* First Name Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-white mb-2">First Name</label>
                <input
                  type="text"
                  name="fname"
                  value={formData.fname || ''}
                  onChange={handleChange}
                  placeholder="First Name"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-slate-700 dark:text-white dark:border-slate-600 transition-colors ${errors.fname ? 'border-red-500' : 'border-gray-200'
                    }`}
                />
                {errors.fname && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.fname}</p>}
              </div>

              {/* Last Name Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-white mb-2">Last Name</label>
                <input
                  type="text"
                  name="lname"
                  value={formData.lname || ''}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-slate-700 dark:text-white dark:border-slate-600 transition-colors ${errors.lname ? 'border-red-500' : 'border-gray-200'
                    }`}
                />
                {errors.lname && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.lname}</p>}
              </div>
            </>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-white mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-slate-700 dark:text-white dark:border-slate-600 transition-colors ${errors.email ? 'border-red-500' : 'border-gray-200'
                }`}
            />
            {errors.email && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.email}</p>}
          </div>

          {/* User Type Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-white mb-2">User Type</label>
            <select
              name="userRole"
              value={formData.userRole}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
            >
              <option value="candidate">Candidate</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          {/* Admin Role Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-white mb-2">Admin Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Password Field - Optional */}
          <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
            <h3 className="text-sm font-bold text-gray-700 dark:text-white mb-4">Change Password (Optional)</h3>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-white mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password || ''}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-slate-700 dark:text-white dark:border-slate-600 transition-colors ${errors.password ? 'border-red-500' : 'border-gray-200'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.password}</p>}
              <p className="text-xs text-gray-500 dark:text-purple-300 mt-2">
                Minimum 6 characters. Leave blank to keep the current password.
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-white rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? <Loader className="w-5 h-5 animate-spin" /> : null}
              {submitting ? 'Updating...' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
