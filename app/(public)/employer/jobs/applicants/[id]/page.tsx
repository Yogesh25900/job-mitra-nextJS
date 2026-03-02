  'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Mail, Phone, Link2, Briefcase, ChevronLeft, Download, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { getTalentProfileById } from '@/lib/api/auth';
import { getApplicationById, updateApplicationStatus } from '@/lib/api/applications';
import { useAuth } from '@/context/AuthContext';

interface TalentUser {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  phoneNumber: string;
  profilePicturePath?: string;
  cvPath?: string;
  skills: string[];
  experiences: Array<{
    title: string;
    company: string;
    period: string;
    location: string;
    description: string;
    isCurrent: boolean;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    period: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
  }>;
  portfolio: Array<{
    id: string;
    title: string;
    portfolioLink: string;
    image?: string;
  }>;
  links?: {
    portfolio?: string;
    linkedin?: string;
    github?: string;
  };
  dateOfBirth?: string;
  title?: string;
  summary?: string;
  location?: string;
}

export default function ApplicantProfile() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();

  // Get talent user ID and application ID from search params
  const userId = searchParams.get('userId');
  const applicationId = searchParams.get('applicationId');
  const jobId = searchParams.get('jobId');
  const jobTitle = searchParams.get('jobTitle')

  const [user, setUser] = useState<TalentUser | null>(null);
  const [applicationStatus, setApplicationStatus] = useState<'Pending' | 'Reviewing' | 'Shortlisted' | 'Rejected' | 'Accepted' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const cvUrl = user?.cvPath ? `http://localhost:5050/resumes/${user.cvPath}` : null;


  // Fetch user profile and application data
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setError('User ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

      
        // Fetch talent user profile
        const userRes = await getTalentProfileById( userId);
        if (userRes.success && userRes.data) {
          setUser(userRes.data);
        } else {
          setError('Failed to load applicant profile');
        }
        console.log('Fetched user profile:', userRes.data);
        // Fetch application status if applicationId provided
        if (applicationId) {
          const appRes = await getApplicationById(applicationId);
          if (appRes.success && appRes.data?.status) {
            setApplicationStatus(appRes.data.status);
          }
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, applicationId, router]);

  // Handle shortlist
  const handleShortlist = async () => {
    if (!applicationId) {
      setStatusError('Application ID not available');
      return;
    }

    if (statusUpdating || applicationStatus === 'Shortlisted') {
      return;
    }

    try {
      setStatusUpdating(true);
      setStatusError(null);
      
      const response = await updateApplicationStatus(applicationId, 'Shortlisted');
      if (response.success) {
        setApplicationStatus('Shortlisted');
      } else {
        setStatusError(response.message || 'Failed to update status');
      }
    } catch (err: any) {
      console.error('Error updating status:', err);
      setStatusError(err?.message || 'Error updating application status');
    } finally {
      setStatusUpdating(false);
    }
  };

  // Handle reject
  const handleReject = async () => {
    if (!applicationId) {
      setStatusError('Application ID not available');
      return;
    }

    if (statusUpdating || applicationStatus === 'Rejected') {
      return;
    }

    try {
      setStatusUpdating(true);
      setStatusError(null);
      
      const response = await updateApplicationStatus(applicationId, 'Rejected');
      if (response.success) {
        setApplicationStatus('Rejected');
      } else {
        setStatusError(response.message || 'Failed to update status');
      }
    } catch (err: any) {
      console.error('Error updating status:', err);
      setStatusError(err?.message || 'Error updating application status');
    } finally {
      setStatusUpdating(false);
    }
  };




  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
            <div className="w-8 h-8 border-3 border-blue-200 dark:border-blue-700 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading applicant profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <AlertCircle className="mx-auto mb-3 text-red-500" />
        <p className="text-gray-600 dark:text-gray-400">
          Applicant profile not found
        </p>
      </div>
    </div>
  );
}



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-200">
      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 mb-6 text-sm">
          <Link
            href={`/employer/jobs/applicants${jobId ? `?jobId=${jobId}` : ''}`}
            className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Applicants
          </Link>
          <span className="text-gray-500 dark:text-gray-400">/</span>
          <span className="text-gray-900 dark:text-white font-medium">
            {user.fname} {user.lname}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 flex flex-col items-center text-center">
              {user.profilePicturePath ? (
                <img
                  src={`http://localhost:5050/profile_pictures/${user.profilePicturePath}`}
                  alt={`${user.fname} ${user.lname}`}
                  className="w-32 h-32 rounded-full object-cover mb-4 ring-4 ring-white/10"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 mb-4 ring-4 ring-white/10 flex items-center justify-center text-white text-4xl font-bold">
                  {`${user.fname || ''} ${user.lname || ''}`
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase() || '?'}
                </div>
              )}


              <h1 className="text-gray-900 dark:text-white text-2xl font-bold">{user.fname} {user.lname}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-base mt-1">{user.email}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 flex items-center justify-center gap-1.5">
                <Phone size={16} />
                {user.phoneNumber}
              </p>
              {user.title && (
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 font-medium">{user.title}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-3">
              <button className="w-full rounded-lg h-11 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                Message Applicant
              </button>
              <button className="w-full rounded-lg h-11 px-4 bg-blue-600/20 hover:bg-blue-600/30 text-blue-600 dark:text-blue-400 text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                Schedule Interview
              </button>
              {statusError && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {statusError}
                </p>
              )}
              <div className="grid grid-cols-2 gap-3">
                {/* Shortlist Button */}
                <button
                  disabled={applicationStatus === 'Shortlisted' || statusUpdating}
                  onClick={handleShortlist}
                  className={`rounded-lg h-10 px-4 text-sm font-bold transition-all shadow-md ${
                    applicationStatus === 'Shortlisted'
                      ? 'bg-green-500/70 text-white cursor-not-allowed opacity-70'
                      : 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
                  } disabled:opacity-60`}
                >
                  {statusUpdating && applicationStatus !== 'Shortlisted' ? 'Updating...' : 'Shortlist'}
                </button>

                {/* Reject Button */}
                <button
                  disabled={applicationStatus === 'Rejected' || statusUpdating}
                  onClick={handleReject}
                  className={`rounded-lg h-10 px-4 text-sm font-bold transition-all shadow-md ${
                    applicationStatus === 'Rejected'
                      ? 'bg-red-500/70 text-white cursor-not-allowed opacity-70'
                      : 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
                  } disabled:opacity-60`}
                >
                  {statusUpdating && applicationStatus !== 'Rejected' ? 'Updating...' : 'Reject'}
                </button>
              </div>
            </div>

            {/* Status Badge */}
            {applicationStatus && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Application Status</p>
                <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-bold ${
                  applicationStatus === 'Shortlisted'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : applicationStatus === 'Rejected'
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                }`}>
                  {applicationStatus}
                </div>
              </div>
            )}

            {/* Contact & Links */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Contact & Links</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <a
                    href={`mailto:${user.email}`}
                    className="text-gray-900 dark:text-white text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-all"
                  >
                    {user.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <a
                    href={`tel:${user.phoneNumber}`}
                    className="text-gray-900 dark:text-white text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {user.phoneNumber}
                  </a>
                </div>
                {user.links?.portfolio && (
                  <div className="flex items-center gap-3">
                    <Link2 size={20} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <a
                      href={user.links.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 dark:text-white text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-all"
                    >
                      Portfolio
                    </a>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6 sm:space-y-8">
            {/* Resume / CV */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Resume / CV</h3>
                {cvUrl && (
                  <a
                    href={cvUrl}
                    download
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Download size={16} />
                    Download
                  </a>
                )}
              </div>
              <div className="aspect-[8.5/11] w-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                {cvUrl ? (
                  <iframe
                    src={cvUrl}
                    width="100%"
                    height="100%"
                    className="rounded-lg"
                    title="Resume / CV"
                  />
                ) : (
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-300 text-sm">
                      No CV uploaded yet
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            {user.skills && user.skills.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-blue-500/20 px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {user.experiences && user.experiences.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Work Experience</h3>
                <div className="relative space-y-8">
                  {/* Timeline Line */}
                  <div className="absolute left-4 top-1 bottom-1 w-0.5 bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

                  {user.experiences.map((exp, index) => (
                    <div key={index} className="flex gap-4 sm:gap-6 relative">
                      <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center ring-4 sm:ring-8 ring-white dark:ring-gray-800 flex-shrink-0">
                        <Briefcase size={16} className="text-white" />
                      </div>
                      <div className="flex-1 pb-8 sm:pb-0">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{exp.period}</p>
                        <h4 className="font-bold text-gray-900 dark:text-white mt-1">
                          {exp.title} at {exp.company}
                        </h4>
                        {exp.location && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{exp.location}</p>
                        )}
                        {exp.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {user.education && user.education.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Education</h3>
                <div className="space-y-4">
                  {user.education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{edu.period}</p>
                      <h4 className="font-bold text-gray-900 dark:text-white">{edu.degree}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {user.certifications && user.certifications.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Certifications</h3>
                <div className="space-y-3">
                  {user.certifications.map((cert, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{cert.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{cert.issuer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio */}
            {user.portfolio && user.portfolio.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Portfolio</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.portfolio.map((item) => (
                    <a
                      key={item.id}
                      href={item.portfolioLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative overflow-hidden rounded-lg"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-40 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="mt-2">
                        <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.portfolioLink}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
