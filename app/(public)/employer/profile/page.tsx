'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  Share2,
  Mail,
  Linkedin,
  Twitter,
  Globe,
  Users,
  MapPin,
  Code,
  Palette,
  Terminal,
  TrendingUp,
  Heart,
  ExternalLink,
  ArrowRight,
  Camera,
  Play,
  X,
  Save,
  Loader,
  Briefcase,
  Zap,
  BarChart3,
} from 'lucide-react';
import { getEmployerProfileById, updateEmployerProfile } from '@/lib/api/employer-api';
import { handleGetEmployerJobs } from '@/lib/actions/job-actions';

interface Job {
  id: string;
  title: string;
  skills: string;
  salary: string;
  type: 'Full-time' | 'Remote' | 'Hybrid' | string;
  postedDays: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  _id?: string;
}

interface Recruiter {
  name: string;
  title: string;
  image: string;
  email: string;
}

interface EmployerProfile {
  _id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  email: string;
  phoneNumber: string;
  industry?: string;
  location?: string;
  companySize?: string;
  website?: string;
  description?: string;
  logoPath?: string;
  googleProfilePicture?: string;
  socialLinks?: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
  };
}

// Helper function to calculate days ago
const calculateDaysAgo = (createdAt: string): number => {
  const jobDate = new Date(createdAt);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - jobDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Helper function to extract category name from string or object
const getCategoryName = (category: any): string => {
  if (typeof category === 'string') return category;
  if (category && typeof category === 'object' && category.name) return category.name;
  return '';
};

// Helper functions for icon assignment based on category
const getIconForCategory = (category: any): React.ReactNode => {
  const categoryName = getCategoryName(category);
  const categoryLower = categoryName?.toLowerCase() || '';
  if (categoryLower.includes('developer') || categoryLower.includes('engineer')) {
    return <Code size={20} />;
  } else if (categoryLower.includes('design')) {
    return <Palette size={20} />;
  } else if (categoryLower.includes('backend')) {
    return <Terminal size={20} />;
  } else if (categoryLower.includes('product') || categoryLower.includes('manager')) {
    return <TrendingUp size={20} />;
  } else if (categoryLower.includes('sales') || categoryLower.includes('business')) {
    return <BarChart3 size={20} />;
  } else if (categoryLower.includes('devops') || categoryLower.includes('infra')) {
    return <Zap size={20} />;
  }
  return <Briefcase size={20} />;
};

const getIconBgForCategory = (category: any): string => {
  const categoryName = getCategoryName(category);
  const categoryLower = categoryName?.toLowerCase() || '';
  if (categoryLower.includes('developer') || categoryLower.includes('engineer')) {
    return 'bg-blue-50 dark:bg-blue-900/20';
  } else if (categoryLower.includes('design')) {
    return 'bg-purple-50 dark:bg-purple-900/20';
  } else if (categoryLower.includes('backend')) {
    return 'bg-orange-50 dark:bg-orange-900/20';
  } else if (categoryLower.includes('product') || categoryLower.includes('manager')) {
    return 'bg-cyan-50 dark:bg-cyan-900/20';
  } else if (categoryLower.includes('sales') || categoryLower.includes('business')) {
    return 'bg-green-50 dark:bg-green-900/20';
  } else if (categoryLower.includes('devops') || categoryLower.includes('infra')) {
    return 'bg-red-50 dark:bg-red-900/20';
  }
  return 'bg-slate-50 dark:bg-slate-900/20';
};

const getIconColorForCategory = (category: any): string => {
  const categoryName = getCategoryName(category);
  const categoryLower = categoryName?.toLowerCase() || '';
  if (categoryLower.includes('developer') || categoryLower.includes('engineer')) {
    return 'text-blue-600';
  } else if (categoryLower.includes('design')) {
    return 'text-purple-600';
  } else if (categoryLower.includes('backend')) {
    return 'text-orange-600';
  } else if (categoryLower.includes('product') || categoryLower.includes('manager')) {
    return 'text-cyan-600';
  } else if (categoryLower.includes('sales') || categoryLower.includes('business')) {
    return 'text-green-600';
  } else if (categoryLower.includes('devops') || categoryLower.includes('infra')) {
    return 'text-red-600';
  }
  return 'text-slate-600';
};

export default function CompanyProfile() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<EmployerProfile>({
    _id: '',
    companyName: '',
    contactName: '',
    contactEmail: '',
    email: '',
    phoneNumber: '',
    industry: '',
    location: '',
    companySize: '',
    website: '',
    description: '',
    logoPath: '',
    socialLinks: {
      linkedin: '',
      facebook: '',
      twitter: '',
    },
  });

  // Fetch employer profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        if (!user?._id) {
          router.push('/login');
          return;
        }

        // const token = localStorage.getItem('token');
        // if (!token) {
        //   router.push('/login');
        //   return;
        // }

        const response = await getEmployerProfileById(user._id);


        if (!response.success) {
          throw new Error('Failed to fetch profile');
        }

        if (response.data) {
          setFormData({
            _id: response.data._id,
            companyName: response.data.companyName || '',
            contactName: response.data.contactName || '',
            contactEmail: response.data.contactEmail || '',
            email: response.data.email || '',
            phoneNumber: response.data.phoneNumber || '',
            industry: response.data.industry || '',
            location: response.data.location || '',
            companySize: response.data.companySize || '',
            website: response.data.website || '',
            description: response.data.description || '',
            logoPath: response.data.logoPath || '',
            socialLinks: response.data.socialLinks || {
              linkedin: '',
              facebook: '',
              twitter: '',
            },
          });

          if (response.data.logoPath) {
            setProfileImagePreview(
              response.data.logoPath
            );
          } else if (response.data.googleProfilePicture) {
            setProfileImagePreview(response.data.googleProfilePicture);
          }
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, router]);

  // Fetch employer jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setJobsLoading(true);
        if (!user?._id) {
          return;
        }

        // Call server action to get employer's jobs
        const response = await handleGetEmployerJobs(1, 5);
        console.log('Employer jobs response:', response);

        if (response.success && response.data) {
          // Map backend job data to UI format
          const formattedJobs: Job[] = response.data.map((backendJob: any) => ({
            id: backendJob._id || backendJob.id,
            title: backendJob.jobTitle || '',
            skills: Array.isArray(backendJob.qualifications)
              ? backendJob.qualifications.join(', ')
              : backendJob.tags?.join(', ') || 'Not specified',
            salary: 'Competitive',
            type: backendJob.jobType || 'Full-time',
            postedDays: calculateDaysAgo(backendJob.createdAt || new Date().toISOString()),
            icon: getIconForCategory(backendJob.jobCategory || ''),
            iconBg: getIconBgForCategory(backendJob.jobCategory || ''),
            iconColor: getIconColorForCategory(backendJob.jobCategory || ''),
          }));

          setJobs(formattedJobs);
        }
      } catch (error: any) {
        console.error('Error fetching jobs:', error);
        // Silently fail but don't show error toast - jobs section is optional
      } finally {
        setJobsLoading(false);
      }
    };

    fetchJobs();
  }, [user?._id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);

      // const token = localStorage.getItem('token');
      // if (!token) {
      //   toast.error('Please login first');
      //   router.push('/login');
      //   return;
      // }

      const formDataToSend = new FormData();
      formDataToSend.append('companyName', formData.companyName);
      formDataToSend.append('contactName', formData.contactName);
      formDataToSend.append('contactEmail', formData.contactEmail);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      formDataToSend.append('industry', formData.industry || '');
      formDataToSend.append('location', formData.location || '');
      formDataToSend.append('companySize', formData.companySize || '');
      formDataToSend.append('website', formData.website || '');
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('socialLinks[linkedin]', formData.socialLinks?.linkedin || '');
      formDataToSend.append('socialLinks[facebook]', formData.socialLinks?.facebook || '');
      formDataToSend.append('socialLinks[twitter]', formData.socialLinks?.twitter || '');

      if (profileImage) {
        formDataToSend.append('logoPath', profileImage);
      }

      const response = await updateEmployerProfile(formDataToSend, formData._id);

      if (!response.success) {
        throw new Error('Failed to update profile');
      }

      if (response.success) {
        toast.success('Profile updated successfully');
        setIsEditMode(false);
        setProfileImage(null);
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark');
    }
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'Full-time':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'Remote':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'Hybrid':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400';
    }
  };


  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <Loader className="animate-spin text-blue-600" size={40} />
          </div>
        ) : (
          <>
            {/* Header Section */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                    {/* Company Logo */}
                    <div className="relative group">
                      <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden">
                        {profileImagePreview ? (
                          <img
                            alt={formData.companyName}
                            src={profileImagePreview}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <Globe className="text-slate-400" size={40} />
                        )}
                      </div>
                      {isEditMode && (
                        <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors">
                          <Camera size={20} />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </label>
                      )}
                    </div>

                    {/* Company Info */}
                    <div className="flex-1 w-full text-center md:text-left space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        {isEditMode ? (
                          <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            className="h-12 w-full md:w-auto px-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-3xl md:text-4xl font-extrabold tracking-tight focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        ) : (
                          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{formData.companyName || 'Company Name'}</h1>
                        )}
                        <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full uppercase tracking-wider">
                            Verified
                          </span>
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full uppercase tracking-wider">
                            Hiring
                          </span>
                        </div>
                      </div>

                      {/* Company Meta */}
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <Globe size={18} />
                          {isEditMode ? (
                            <input
                              type="text"
                              name="website"
                              value={formData.website}
                              onChange={handleInputChange}
                              className="h-8 w-36 px-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                          ) : (
                            <span className="text-sm">{formData.website || '-'}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={18} />
                          {isEditMode ? (
                            <input
                              type="text"
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                              className="h-8 w-36 px-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                          ) : (
                            <span className="text-sm">{formData.location || '-'}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={18} />
                          {isEditMode ? (
                            <input
                              type="text"
                              name="companySize"
                              value={formData.companySize}
                              onChange={handleInputChange}
                              className="h-8 w-36 px-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                          ) : (
                            <span className="text-sm">{formData.companySize || '-'}</span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 justify-center md:justify-start pt-2">
                        {isEditMode ? (
                          <>
                            <button
                              onClick={handleSaveProfile}
                              disabled={isSaving}
                              className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all shadow-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                            >
                              {isSaving ? (
                                <>
                                  <Loader size={18} className="animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save size={18} />
                                  Save Changes
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => setIsEditMode(false)}
                              disabled={isSaving}
                              className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
                            >
                              <X size={18} />
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setIsEditMode(true)}
                              className="px-6 py-2.5 rounded-lg font-semibold transition-all shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Edit Profile
                            </button>
                            <button className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                              <Share2 size={20} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-8 space-y-8">
                  {/* About Section */}
                  <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <Globe className="text-blue-600" size={24} />
                      About {formData.companyName}
                    </h2>
                    <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                      {isEditMode ? (
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Company description..."
                          rows={4}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      ) : (
                        <p>
                          {formData.description || `${formData.companyName} is a premier recruitment firm specializing in connecting world-class talent with leading technology
                          companies. Our mission is to bridge the gap between innovation and the professionals who drive it forward.`}
                        </p>
                      )}
                    </div>
                  </section>

                  {/* Jobs Section */}
                  <section>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Code className="text-blue-600" size={24} />
                        Active Roles at {formData.companyName}
                      </h2>
                      <Link
                        href="/employer"
                        className="text-blue-600 font-medium hover:underline flex items-center gap-1 transition-colors"
                      >
                        View all {jobs.length} jobs
                        <ArrowRight size={16} />
                      </Link>
                    </div>

                    {jobsLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader className="animate-spin text-blue-600" size={32} />
                      </div>
                    ) : jobs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {jobs.map((job) => (
                          <div
                            key={job.id}
                            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-600 transition-colors cursor-pointer group shadow-sm hover:shadow-md"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className={`w-10 h-10 ${job.iconBg} rounded-lg flex items-center justify-center`}>
                                <span className={job.iconColor}>{job.icon}</span>
                              </div>
                              <span className="text-xs font-bold text-slate-400 uppercase">{job.postedDays} days ago</span>
                            </div>

                            <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors mb-1">{job.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">{job.skills}</p>

                            <div className="flex items-center justify-between">
                              <span className={`text-xs px-2 py-1 rounded font-medium ${getJobTypeColor(job.type)}`}>
                                {job.type}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                        <Code className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-500 dark:text-slate-400 mb-4">No jobs posted yet</p>
                        <Link
                          href="/employer/add-job"
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        >
                          Post a Job
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    )}
                  </section>
                </div>

                {/* Right Sidebar */}
                <aside className="lg:col-span-4 space-y-6">
                  {/* Recruiter Contact */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-6">Your Primary Contact</h3>

                    {/* Recruiter Info */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center text-slate-600 dark:text-slate-200 font-bold text-lg flex-shrink-0">
                        {profileImagePreview ? (
                          <img alt={formData.contactName} src={profileImagePreview} className="w-full h-full object-cover" />
                        ) : (
                          formData.contactName?.charAt(0)?.toUpperCase()
                        )}
                      </div>
                      <div className="w-full">
                        {isEditMode ? (
                          <input
                            type="text"
                            name="contactName"
                            value={formData.contactName}
                            onChange={handleInputChange}
                            className="h-10 w-full px-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        ) : (
                          <p className="font-bold text-lg">{formData.contactName}</p>
                        )}
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Lead Recruiter</p>
                      </div>
                    </div>

                    {/* Contact Actions */}
                    <div className="space-y-4">
                      {isEditMode ? (
                        <div className="flex items-center gap-3 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                          <Mail className="text-blue-600" size={20} />
                          <input
                            type="email"
                            name="contactEmail"
                            value={formData.contactEmail}
                            onChange={handleInputChange}
                            className="w-full bg-transparent focus:outline-none text-sm font-medium"
                            placeholder="Contact email"
                          />
                        </div>
                      ) : (
                        <Link
                          href={`mailto:${formData.contactEmail || formData.email}`}
                          className="flex items-center gap-3 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                        >
                          <Mail className="text-blue-600 group-hover:scale-110 transition-transform" size={20} />
                          <span className="text-sm font-medium truncate">{formData.contactEmail || formData.email}</span>
                        </Link>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href="#"
                          className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                        >
                          <Linkedin className="text-blue-700 dark:text-blue-400 group-hover:scale-110 transition-transform" size={18} />
                          <span className="text-sm font-semibold">LinkedIn</span>
                        </Link>
                        <Link
                          href="#"
                          className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                        >
                          <Twitter className="text-black dark:text-white group-hover:scale-110 transition-transform" size={18} />
                          <span className="text-sm font-semibold">Twitter</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Company Details */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-4">Company Details</h3>

                    <ul className="space-y-4">
                      <li className="flex items-start gap-4">
                        <Globe className="text-slate-400 flex-shrink-0 mt-1" size={20} />
                        <div className="w-full">
                          <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">Website</p>
                          {isEditMode ? (
                            <input
                              type="url"
                              name="website"
                              value={formData.website}
                              onChange={handleInputChange}
                              className="h-10 w-full px-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                          ) : (
                            formData.website && (
                              <Link
                                href={formData.website}
                                target="_blank"
                                className="text-blue-600 hover:underline font-medium flex items-center gap-1 group"
                              >
                                {formData.website}
                                <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                              </Link>
                            )
                          )}
                        </div>
                      </li>

                      <li className="flex items-start gap-4">
                        <Users className="text-slate-400 flex-shrink-0 mt-1" size={20} />
                        <div className="w-full">
                          <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">Company Size</p>
                          {isEditMode ? (
                            <input
                              type="text"
                              name="companySize"
                              value={formData.companySize}
                              onChange={handleInputChange}
                              className="h-10 w-full px-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                          ) : (
                            <p className="font-medium">{formData.companySize}</p>
                          )}
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Social Links */}
                  {(formData.socialLinks && (Object.values(formData.socialLinks).some(link => link))) && (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                      <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-4">Social Presence</h3>

                      <div className="flex gap-4">
                        {formData.socialLinks?.linkedin && (
                          <Link
                            href={formData.socialLinks.linkedin}
                            target="_blank"
                            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all group"
                            title="LinkedIn"
                          >
                            <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
                          </Link>
                        )}
                        {formData.socialLinks?.facebook && (
                          <Link
                            href={formData.socialLinks.facebook}
                            target="_blank"
                            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all group"
                            title="Facebook"
                          >
                            <Globe size={20} className="group-hover:scale-110 transition-transform" />
                          </Link>
                        )}
                        {formData.socialLinks?.twitter && (
                          <Link
                            href={formData.socialLinks.twitter}
                            target="_blank"
                            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all group"
                            title="Twitter"
                          >
                            <Twitter size={20} className="group-hover:scale-110 transition-transform" />
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </aside>
              </div>
            </main>

          
           
          </>
        )}
      </div>
    </div>
  );
}