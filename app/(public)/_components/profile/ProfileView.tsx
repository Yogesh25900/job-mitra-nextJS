"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Mail, Phone, MapPin, Calendar, Briefcase, Building2, Award, FileText, Link2, BadgeCheck, GraduationCap, Camera, Save, X, Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getTalentProfileById, getTalentProfileMe, updateTalentProfile } from "@/lib/api/talent-api";
import { getEmployerProfileById } from "@/lib/api/employer-api";
import { handleTalentPhotoUpdate, handleTalentProfileUpdate } from "@/lib/actions/talent-action";

export type ProfileRole = "talent" | "recruiter";

interface TalentProfileData {
  _id: string;
  fname?: string;
  lname?: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  location?: string;
  summary?: string;
  profilePicturePath?: string;
  googleProfilePicture?: string;
  title?: string;
  skills?: string[];
  experiences?: Array<{
    title: string;
    company: string;
    period: string;
    location?: string;
    description?: string;
    isCurrent?: boolean;
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    period: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
  }>;
  portfolio?: Array<{
    id?: string;
    title?: string;
    portfolioLink?: string;
    image?: string;
  }>;
  cvPath?: string;
  links?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
}

interface RecruiterProfileData {
  _id: string;
  companyName?: string;
  contactName?: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  profilePicturePath?: string;
  googleProfilePicture?: string;
}

type ProfileData = TalentProfileData | RecruiterProfileData;

interface ProfileViewProps {
  role: ProfileRole;
  editPath: string;
}

const resolveImageUrl = (path?: string) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  return `${baseUrl}/profile_pictures/${path}`;
};

export default function ProfileView({ role, editPath }: ProfileViewProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<ProfileData | null>(null);

  const isTalent = role === "talent";

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("Please log in to view your profile");
      router.push("/login");
      return;
    }

    const fetchProfileData = async () => {
      try {
        setError(null);
        if (isAuthenticated && !loading) {
        
          if (!user?._id) {
            setError('User ID not found');
            return;
          }

          const response = isTalent
            ? await getTalentProfileById( user._id)
            : await getEmployerProfileById( user._id);

          console.log("Fetched profile data:", response);
          if (response.success && response.data) {
            setProfileData(response.data);
            setFormData(response.data);
            
            // Set profile image preview
            const imagePath = isTalent 
              ? (response.data as TalentProfileData).profilePicturePath || (response.data as TalentProfileData).googleProfilePicture
              : (response.data as RecruiterProfileData).profilePicturePath || (response.data as RecruiterProfileData).googleProfilePicture;
            
            if (imagePath) {
              if (imagePath.startsWith('http')) {
                setProfileImagePreview(imagePath);
              } else {
                const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
                setProfileImagePreview(`${baseUrl}/profile_pictures/${imagePath}`);
              }
            }
          } else if (user) {
            setProfileData(user);
            setFormData(user);
          } else {
            setError(response.message || "Unable to load profile");
          }
        }
      } catch (err: any) {
        console.error("Failed to fetch profile:", err);
        if (user) {
          setProfileData(user);
          setFormData(user);
        } else {
          setError(err?.message || "Unable to load profile");
        }
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (isAuthenticated && !loading) {
      fetchProfileData();
    }
  }, [isAuthenticated, isTalent, loading, router, user]);

  const displayName = useMemo(() => {
    const data = isEditMode ? formData : profileData;
    if (!data) return "";
    if (isTalent) {
      const talent = data as TalentProfileData;
      return [talent.fname, talent.lname].filter(Boolean).join(" ") || "Talent User";
    }
    const recruiter = data as RecruiterProfileData;
    return recruiter.companyName || recruiter.contactName || "Recruiter";
  }, [isTalent, profileData, formData, isEditMode]);

  const subtitle = useMemo(() => {
    const data = isEditMode ? formData : profileData;
    if (!data) return "";
    if (isTalent) {
      const talent = data as TalentProfileData;
      return talent.title || "Talent Profile";
    }
    const recruiter = data as RecruiterProfileData;
    return recruiter.contactName || "Recruiter Profile";
  }, [isTalent, profileData, formData, isEditMode]);

  const profileImageUrl = useMemo(() => {
    if (profileImagePreview) {
      return profileImagePreview;
    }
    const data = isEditMode ? formData : profileData;
    if (!data) return null;
    const imagePath = (data as TalentProfileData).profilePicturePath
      || (data as TalentProfileData).googleProfilePicture
      || (data as RecruiterProfileData).profilePicturePath
      || (data as RecruiterProfileData).googleProfilePicture;
    return resolveImageUrl(imagePath);
  }, [profileData, formData, isEditMode, profileImagePreview]);

  const talentProfile = (formData || profileData || {}) as TalentProfileData;
  const recruiterProfile = (formData || profileData || {}) as RecruiterProfileData;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      await handleSaveProfilePhoto(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFile(file);
    }
  };

  const handleRemoveCv = () => {
    setFormData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        cvPath: '',
      } as ProfileData;
    });
    setCvFile(null);
  };

  const handleLinkChange = (field: 'linkedin' | 'github' | 'portfolio', value: string) => {
    setFormData(prev => {
      if (!prev) return prev;
      const talentData = prev as TalentProfileData;
      return {
        ...prev,
        links: {
          ...(talentData.links || {}),
          [field]: value,
        },
      };
    });
  };

  const handleAddExperience = () => {
    if (!formData || !isTalent) return;
    const talentData = formData as TalentProfileData;
    setFormData({
      ...formData,
      experiences: [
        ...(talentData.experiences || []),
        { title: '', company: '', period: '', location: '', description: '', isCurrent: false },
      ],
    });
  };

  const handleRemoveExperience = (index: number) => {
    if (!formData || !isTalent) return;
    const talentData = formData as TalentProfileData;
    setFormData({
      ...formData,
      experiences: (talentData.experiences || []).filter((_, i) => i !== index),
    });
  };

  const handleEditExperience = (index: number, field: string, value: any) => {
    if (!formData || !isTalent) return;
    const talentData = formData as TalentProfileData;
    const updated = [...(talentData.experiences || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({
      ...formData,
      experiences: updated,
    });
  };

  const handleAddEducation = () => {
    if (!formData || !isTalent) return;
    const talentData = formData as TalentProfileData;
    setFormData({
      ...formData,
      education: [
        ...(talentData.education || []),
        { degree: '', institution: '', period: '' },
      ],
    });
  };

  const handleRemoveEducation = (index: number) => {
    if (!formData || !isTalent) return;
    const talentData = formData as TalentProfileData;
    setFormData({
      ...formData,
      education: (talentData.education || []).filter((_, i) => i !== index),
    });
  };

  const handleEditEducation = (index: number, field: string, value: any) => {
    if (!formData || !isTalent) return;
    const talentData = formData as TalentProfileData;
    const updated = [...(talentData.education || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({
      ...formData,
      education: updated,
    });
  };

  const handleAddCertification = () => {
    if (!formData || !isTalent) return;
    const talentData = formData as TalentProfileData;
    setFormData({
      ...formData,
      certifications: [
        ...(talentData.certifications || []),
        { name: '', issuer: '' },
      ],
    });
  };

  const handleRemoveCertification = (index: number) => {
    if (!formData || !isTalent) return;
    const talentData = formData as TalentProfileData;
    setFormData({
      ...formData,
      certifications: (talentData.certifications || []).filter((_, i) => i !== index),
    });
  };

  const handleEditCertification = (index: number, field: string, value: any) => {
    if (!formData || !isTalent) return;
    const talentData = formData as TalentProfileData;
    const updated = [...(talentData.certifications || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({
      ...formData,
      certifications: updated,
    });
  };

  const handleSaveProfilePhoto = async (file: File) => {
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('profilePicture', file);
      
      const response = await handleTalentPhotoUpdate(formDataToSend);
      
      if (!response.success) {
        throw new Error('Failed to upload profile photo');
      }
      
      // Update the profile data with new image path
      setProfileData(prev => prev ? {
        ...prev,
        profilePicturePath: response.data?.profilePicturePath || prev.profilePicturePath
      } : null);
      
      setFormData(prev => prev ? {
        ...prev,
        profilePicturePath: response.data?.profilePicturePath || prev.profilePicturePath
      } : null);
      
      setProfileImage(null);
      toast.success('Profile photo updated successfully');
    } catch (error: any) {
      console.error('Error saving profile photo:', error);
      toast.error('Failed to save profile photo');
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);

     
      const formDataToSend = new FormData();
      
      if (isTalent) {
        const talentData = formData as TalentProfileData;
        formDataToSend.append('fname', talentData.fname || '');
        formDataToSend.append('lname', talentData.lname || '');
        formDataToSend.append('email', talentData.email || '');
        formDataToSend.append('phoneNumber', talentData.phoneNumber || '');
        formDataToSend.append('dateOfBirth', talentData.dateOfBirth || '');
        formDataToSend.append('location', talentData.location || '');
        formDataToSend.append('summary', talentData.summary || '');
        formDataToSend.append('title', talentData.title || '');

        const skills = talentData.skills ?? [];
        const experiences = talentData.experiences ?? [];
        const education = talentData.education ?? [];
        const certifications = talentData.certifications ?? [];
        const links = talentData.links ?? {};

        formDataToSend.append('skills', JSON.stringify(skills));
        formDataToSend.append('experiences', JSON.stringify(experiences));
        formDataToSend.append('education', JSON.stringify(education));
        formDataToSend.append('certifications', JSON.stringify(certifications));
        formDataToSend.append('links[linkedin]', links.linkedin || '');
        formDataToSend.append('links[github]', links.github || '');
        formDataToSend.append('links[portfolio]', links.portfolio || '');

        if (cvFile) {
          formDataToSend.append('resume', cvFile);
        }
      }

      const response = await handleTalentProfileUpdate(formDataToSend,  user._id);

      if (!response.success) {
        throw new Error('Failed to update profile');
      }

      setProfileData(response.data);
      setFormData(response.data);
      setCvFile(null);
      toast.success('Profile updated successfully');
      
      setProfileImagePreview('');
      setIsEditMode(false);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const profileStrength = useMemo(() => {
    if (!isTalent) return 0;
    const talent = formData ? (formData as TalentProfileData) : (profileData as TalentProfileData);
    if (!talent) return 0;
    const checks = [
      !!talent.summary,
      !!talent.title,
      !!talent.location,
      !!talent.phoneNumber,
      (talent.skills || []).length > 0,
      (talent.experiences || []).length > 0,
      (talent.education || []).length > 0,
      (talent.certifications || []).length > 0,
      !!talent.links?.linkedin,
    ];
    const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
    return Number.isFinite(score) ? score : 0;
  }, [isTalent, talentProfile, formData, profileData]);

  if (loading || isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 text-center">
        <p className="text-slate-600 dark:text-slate-300">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          onClick={() => router.refresh()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 text-center">
        <p className="text-slate-600 dark:text-slate-300">Profile data not available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div className="flex flex-col gap-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center text-slate-600 dark:text-slate-200 font-bold text-lg">
                {profileImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  displayName
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                )}
              </div>
              {isEditMode && (
                <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors">
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
            <div className="flex-1">
              {isEditMode && isTalent ? (
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    name="fname"
                    value={(formData as TalentProfileData)?.fname || ''}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <input
                    type="text"
                    name="lname"
                    value={(formData as TalentProfileData)?.lname || ''}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              ) : (
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{displayName}</h1>
              )}
              {isEditMode && isTalent ? (
                <input
                  type="text"
                  name="title"
                  value={(formData as TalentProfileData)?.title || ''}
                  onChange={handleInputChange}
                  placeholder="Job Title"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              ) : (
                <p className="text-slate-500 dark:text-slate-400 text-sm">{subtitle}</p>
              )}
              {isTalent && (formData as TalentProfileData)?.location && !isEditMode && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {(formData as TalentProfileData)?.location}
                </p>
              )}
              {isEditMode && isTalent && (
                <input
                  type="text"
                  name="location"
                  value={(formData as TalentProfileData)?.location || ''}
                  onChange={handleInputChange}
                  placeholder="Location"
                  className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              )}
            </div>
          </div>
          {isEditMode ? (
            <div className="flex gap-2">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setIsEditMode(false);
                  setFormData(profileData);
                  setProfileImage(null);
                  setProfileImagePreview('');
                }}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          ) : (
            <Link
              href={editPath}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold"
              onClick={(e) => {
                e.preventDefault();
                setIsEditMode(true);
              }}
            >
              Edit Profile
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {isTalent && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">About Me</h2>
              {isEditMode ? (
                <textarea
                  name="summary"
                  value={(formData as TalentProfileData)?.summary || ''}
                  onChange={handleInputChange}
                  placeholder="Tell employers about your background and goals..."
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {(formData as TalentProfileData)?.summary || "Tell employers about your background and goals."}
                </p>
              )}
            </div>
          )}

          {isTalent && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Experience</h2>
                {isEditMode && (
                  <button
                    onClick={handleAddExperience}
                    className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                  >
                    + Add
                  </button>
                )}
              </div>
              {(talentProfile.experiences || []).length > 0 ? (
                <div className="space-y-4">
                  {talentProfile.experiences?.map((exp, index) => (
                    <div key={`experience-${index}`} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                      {isEditMode ? (
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={exp.title}
                              onChange={(e) => handleEditExperience(index, 'title', e.target.value)}
                              placeholder="Job Title"
                              className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                            <button
                              onClick={() => handleRemoveExperience(index)}
                              className="px-2 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            >
                              <X size={18} />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleEditExperience(index, 'company', e.target.value)}
                            placeholder="Company Name"
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                          <input
                            type="text"
                            value={exp.period}
                            onChange={(e) => handleEditExperience(index, 'period', e.target.value)}
                            placeholder="Period (e.g., Jan 2020 - Present)"
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                          <input
                            type="text"
                            value={exp.location || ''}
                            onChange={(e) => handleEditExperience(index, 'location', e.target.value)}
                            placeholder="Location"
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                          <textarea
                            value={exp.description || ''}
                            onChange={(e) => handleEditExperience(index, 'description', e.target.value)}
                            placeholder="Description"
                            rows={2}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">{exp.title}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{exp.company}</p>
                            </div>
                            <span className="text-xs text-slate-400">{exp.period}</span>
                          </div>
                          {exp.description && (
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{exp.description}</p>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-300">No experience added yet.</p>
              )}
            </div>
          )}

          {isTalent && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Education</h2>
                {isEditMode && (
                  <button
                    onClick={handleAddEducation}
                    className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                  >
                    + Add
                  </button>
                )}
              </div>
              {(talentProfile.education || []).length > 0 ? (
                <div className="space-y-4">
                  {talentProfile.education?.map((edu, index) => (
                    <div key={`education-${index}`} className={isEditMode ? "border border-slate-200 dark:border-slate-700 rounded-lg p-4" : "flex items-start gap-3"}>
                      {isEditMode ? (
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => handleEditEducation(index, 'degree', e.target.value)}
                              placeholder="Degree (e.g., Bachelor of Science)"
                              className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                            <button
                              onClick={() => handleRemoveEducation(index)}
                              className="px-2 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            >
                              <X size={18} />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => handleEditEducation(index, 'institution', e.target.value)}
                            placeholder="Institution Name"
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                          <input
                            type="text"
                            value={edu.period}
                            onChange={(e) => handleEditEducation(index, 'period', e.target.value)}
                            placeholder="Period (e.g., 2018 - 2022)"
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                      ) : (
                        <>
                          <GraduationCap className="w-5 h-5 text-primary flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{edu.degree}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{edu.institution}</p>
                            <p className="text-xs text-slate-400">{edu.period}</p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-300">No education added yet.</p>
              )}
            </div>
          )}

          {isTalent && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Certifications</h2>
                {isEditMode && (
                  <button
                    onClick={handleAddCertification}
                    className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                  >
                    + Add
                  </button>
                )}
              </div>
              {(talentProfile.certifications || []).length > 0 ? (
                <div className="space-y-3">
                  {talentProfile.certifications?.map((cert, index) => (
                    <div key={`cert-${index}`} className={isEditMode ? "border border-slate-200 dark:border-slate-700 rounded-lg p-4" : "flex items-start gap-3"}>
                      {isEditMode ? (
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={cert.name}
                              onChange={(e) => handleEditCertification(index, 'name', e.target.value)}
                              placeholder="Certification Name"
                              className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                            <button
                              onClick={() => handleRemoveCertification(index)}
                              className="px-2 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            >
                              <X size={18} />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) => handleEditCertification(index, 'issuer', e.target.value)}
                            placeholder="Issuing Organization"
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                      ) : (
                        <>
                          <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{cert.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{cert.issuer}</p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-300">No certifications added yet.</p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {isTalent && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Profile Strength</h2>
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                <span>Completion</span>
                <span className="font-semibold text-primary">{profileStrength}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${profileStrength}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Complete your profile to increase visibility.
              </p>
            </div>
          )}

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Contact Information</h2>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {isEditMode ? (
                  <input
                    type="email"
                    name="email"
                    value={formData?.email || ''}
                    onChange={handleInputChange}
                    className="flex-1 px-2 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                ) : (
                  <span>{formData?.email || "N/A"}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {isEditMode ? (
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData?.phoneNumber || ''}
                    onChange={handleInputChange}
                    className="flex-1 px-2 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                ) : (
                  <span>{formData?.phoneNumber || "N/A"}</span>
                )}
              </div>
              {isTalent ? (
                <>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {isEditMode ? (
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={(formData as TalentProfileData)?.dateOfBirth || ''}
                        onChange={handleInputChange}
                        className="flex-1 px-2 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    ) : (
                      <span>{(formData as TalentProfileData)?.dateOfBirth || "N/A"}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{(formData as TalentProfileData)?.title || "N/A"}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>{(formData as RecruiterProfileData)?.companyName || "N/A"}</span>
                </div>
              )}
            </div>
          </div>

          {isTalent && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Skills</h2>
              {isEditMode ? (
                <textarea
                  name="skills"
                  placeholder="Enter skills separated by commas (e.g., React, TypeScript, Node.js)"
                  defaultValue={(formData as TalentProfileData)?.skills?.join(', ') || ''}
                  onChange={(e) => {
                    const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    if (formData) {
                      setFormData({
                        ...formData,
                        skills: skillsArray,
                      });
                    }
                  }}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              ) : (
                <>
                  {formData && (formData as TalentProfileData)?.skills && (formData as TalentProfileData).skills!.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {(formData as TalentProfileData).skills!.map((skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600 dark:text-slate-300">No skills added.</p>
                  )}
                </>
              )}
            </div>
          )}

          {isTalent && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Links</h2>
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  {isEditMode ? (
                    <input
                      type="url"
                      value={(formData as TalentProfileData)?.links?.portfolio || ''}
                      onChange={(e) => handleLinkChange('portfolio', e.target.value)}
                      placeholder="Portfolio URL"
                      className="flex-1 px-2 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  ) : (
                    <span>{talentProfile.links?.portfolio || "N/A"}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  {isEditMode ? (
                    <input
                      type="url"
                      value={(formData as TalentProfileData)?.links?.linkedin || ''}
                      onChange={(e) => handleLinkChange('linkedin', e.target.value)}
                      placeholder="LinkedIn URL"
                      className="flex-1 px-2 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  ) : (
                    <span>{talentProfile.links?.linkedin || "N/A"}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  {isEditMode ? (
                    <input
                      type="url"
                      value={(formData as TalentProfileData)?.links?.github || ''}
                      onChange={(e) => handleLinkChange('github', e.target.value)}
                      placeholder="GitHub URL"
                      className="flex-1 px-2 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  ) : (
                    <span>{talentProfile.links?.github || "N/A"}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {isTalent && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Documents</h2>
              <div className="space-y-3">
                <div className="relative flex items-center justify-between border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2">
                  {isEditMode && (talentProfile.cvPath || cvFile) && (
                    <button
                      type="button"
                      onClick={handleRemoveCv}
                      className="absolute right-2 top-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg p-1"
                      aria-label="Remove CV"
                    >
                      <X size={14} />
                    </button>
                  )}
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <FileText className="w-4 h-4" />
                    <span>
                      {cvFile?.name
                        || talentProfile.cvPath
                        || "Resume not uploaded"}
                    </span>
                  </div>
                  {!isEditMode && talentProfile.cvPath && (
                    <a
                      className="text-xs text-primary font-semibold"
                      href={`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050"}/resumes/${talentProfile.cvPath}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  )}
                </div>
                {isEditMode && !talentProfile.cvPath && !cvFile && (
                  <label className="flex items-center justify-center border border-dashed border-slate-300 dark:border-slate-600 rounded-lg px-3 py-4 text-sm text-slate-500 dark:text-slate-400 cursor-pointer hover:border-blue-500 hover:text-blue-600">
                    Click to upload CV
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleCvChange}
                    />
                  </label>
                )}
                {(talentProfile.portfolio || []).map((item, index) => (
                  <div key={`${item.title}-${index}`} className="flex items-center justify-between border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <Award className="w-4 h-4" />
                      <span>{item.title || "Portfolio item"}</span>
                    </div>
                    {item.portfolioLink && (
                      <a
                        className="text-xs text-primary font-semibold"
                        href={item.portfolioLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </main>
    </div>
  );
}
