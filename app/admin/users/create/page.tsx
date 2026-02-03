'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSideBar from '../../_components/AdminSideBar';
import { handleCreateUserAsAdmin } from '@/lib/actions/admin/admin-actions';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

export default function CreateUserPage() {
  const router = useRouter();
  const { user: authUser, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check authorization
  useEffect(() => {
    if (!isAuthenticated || authUser?.role !== 'admin') {
      router.push('/login');
    }
  }, [isAuthenticated, authUser, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const { confirmPassword, ...userData } = formData;
      
      const response = await handleCreateUserAsAdmin(userData);

      if (response.success) {
        toast.success('User created successfully!');
        router.push('/admin/users');
      } else {
        toast.error(response.message || 'Failed to create user');
        setErrors({ submit: response.message || 'Failed to create user' });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Error creating user');
      setErrors({ submit: 'Error creating user' });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || authUser?.role !== 'admin') {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900">
      <AdminSideBar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white dark:bg-slate-800">
        {/* Header */}
        <header className="h-16 flex items-center px-8 border-b border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Link href="/admin/users" className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors inline-flex">
              <ArrowLeft className="w-5 h-5" />
            </Link>

            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm font-medium">
              <a className="text-gray-500 dark:text-purple-300 hover:text-purple-600" href="/admin">
                Admin
              </a>
              <span className="text-gray-400">/</span>
              <Link href="/admin/users" className="text-gray-500 dark:text-purple-300 hover:text-purple-600">
                User Management
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 dark:text-white">Create User</span>
            </nav>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto p-8">
            {/* Page Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Create New User</h2>
              <p className="text-gray-500 dark:text-purple-300 mt-2">Add a new user to the platform.</p>
            </div>

            {/* Form Container */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* General Error */}
                {errors.submit && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg">
                    <p className="text-sm text-red-700 dark:text-red-400">{errors.submit}</p>
                  </div>
                )}

                {/* Name Field */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-white mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-slate-700 dark:text-white dark:border-slate-600 transition-colors ${
                      errors.name ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-white mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-slate-700 dark:text-white dark:border-slate-600 transition-colors ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Role Field */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-white mb-2">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                  >
                    <option value="user">User (Candidate/Employer)</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-white mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-slate-700 dark:text-white dark:border-slate-600 transition-colors ${
                        errors.password ? 'border-red-500' : 'border-gray-200'
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
                  {errors.password && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-white mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-slate-700 dark:text-white dark:border-slate-600 transition-colors ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-slate-700">
                  <Link href="/admin/users" className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-white rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-center inline-flex items-center justify-center">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader className="w-5 h-5 animate-spin" /> : null}
                    {loading ? 'Creating...' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>

            {/* Information Box */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                <strong>Tip:</strong> You can assign different roles during user creation. Users with the 'Admin' role will have access to the admin panel.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
