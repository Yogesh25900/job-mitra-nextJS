"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
import { handleGetTalentProfileById, handleTalentProfileUpdate, handleUploadTalentProfilePhoto } from "@/lib/actions/auth-action";
import { uploadTalentProfilePhoto } from "@/lib/api/auth";

interface ProfileData {
  _id: string;
  fname?: string;
  lname?: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  location?: string;
  summary?: string;
  profilePicturePath?: string;
  cvPath?: string;
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
    id: string;
    title: string;
    portfolioLink: string;
    image: string;
  }>;
  links?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export default function EditProfileForm() {
  const { user, isAuthenticated, loading, setUser } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("Please log in to edit your profile");
      router.push("/login");
      return;
    }

    const fetchProfileData = async () => {
      try {
        if (isAuthenticated && !loading) {
          const response = await handleGetTalentProfileById();
          console.log("🚀 fetchProfileData response:", response);

          if (response.success && response.data) {
            setProfileData(response.data);
            // Set preview for existing image
            if (response.data.profilePicturePath) {
              const imageUrl = `http://localhost:5050/profile_pictures/${response.data.profilePicturePath}`;
              setProfileImagePreview(imageUrl);
              console.log("📸 Existing image URL:", imageUrl);
            }
          } else {
            // Fallback to user from context if API fetch fails
            if (user) {
              setProfileData(user);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        // Fallback to user from context
        if (user) {
          setProfileData(user);
        }
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (isAuthenticated && !loading) {
      fetchProfileData();
    }
  }, [user, isAuthenticated, loading, router]);

  if (loading || isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Unable to Load Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof ProfileData
  ) => {
    setProfileData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: e.target.value,
      };
    });
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Auto-upload image immediately
      try {
        console.log(" Auto-uploading profile picture:", file.name);
        console.log(" File size:", file.size, "bytes");
        console.log(" File type:", file.type);
        
        const imageFormData = new FormData();
        imageFormData.append("profilePicture", file);
        
        // Debug: Log FormData contents BEFORE sending
        console.log(" FormData contents (client-side):");
        for (let [key, value] of imageFormData.entries()) {
          if (value instanceof File) {
            console.log(`  - ${key}: File(${value.name}, ${value.size} bytes, type: ${value.type})`);
          } else {
            console.log(`  - ${key}:`, value);
          }
        }
        
        // Use server action which will call getAuthToken()
        const response = await handleUploadTalentProfilePhoto(imageFormData);
        console.log("Auto-upload response:", response);
          
        if (response.success) {
          toast.success("Profile picture uploaded successfully!");
          console.log(" Profile picture uploaded:", response.data);
          
          // Update profileData with the new profilePicturePath from backend
          if (response.data) {
            setProfileData((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                profilePicturePath: response.data,
              };
            });
            
            // Also update AuthContext user to refresh navbar/header
            setUser((prev: any) => ({
              ...prev,
              profilePicturePath: response.data,
            }));
            
            console.log("✓ Profile data updated with new profilePicturePath:", response.data);
          }
        } else {
          toast.error("Failed to upload profile picture");
        }
      } catch (error: any) {
        console.error("Error uploading picture:", error);
        toast.error("Error uploading profile picture");
      }
    }
  };

  const handleAddSkill = () => {
    setProfileData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        skills: [...(prev.skills || []), ""],
      };
    });
  };

  const handleSkillChange = (index: number, value: string) => {
    setProfileData((prev) => {
      if (!prev) return prev;
      const updatedSkills = [...(prev.skills || [])];
      updatedSkills[index] = value;
      return {
        ...prev,
        skills: updatedSkills,
      };
    });
  };

  const handleRemoveSkill = (index: number) => {
    setProfileData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        skills: prev.skills?.filter((_, i) => i !== index) || [],
      };
    });
  };

  const handleAddExperience = () => {
    setProfileData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        experiences: [
          ...(prev.experiences || []),
          { title: "", company: "", period: "", location: "", description: "" },
        ],
      };
    });
  };

  const handleExperienceChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setProfileData((prev) => {
      if (!prev) return prev;
      const updatedExperiences = [...(prev.experiences || [])];
      updatedExperiences[index] = {
        ...updatedExperiences[index],
        [field]: value,
      };
      return {
        ...prev,
        experiences: updatedExperiences,
      };
    });
  };

  const handleRemoveExperience = (index: number) => {
    setProfileData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        experiences: prev.experiences?.filter((_, i) => i !== index) || [],
      };
    });
  };

  const handleAddEducation = () => {
    setProfileData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        education: [
          ...(prev.education || []),
          { institution: "", degree: "", period: "" },
        ],
      };
    });
  };

  const handleEducationChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setProfileData((prev) => {
      if (!prev) return prev;
      const updatedEducation = [...(prev.education || [])];
      updatedEducation[index] = {
        ...updatedEducation[index],
        [field]: value,
      };
      return {
        ...prev,
        education: updatedEducation,
      };
    });
  };

  const handleRemoveEducation = (index: number) => {
    setProfileData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        education: prev.education?.filter((_, i) => i !== index) || [],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!profileData) {
        toast.error("Profile data is missing");
        return;
      }

      const formData = new FormData();
      formData.append("fname", profileData.fname || "");
      formData.append("lname", profileData.lname || "");
      formData.append("email", profileData.email || "");
      formData.append("phoneNumber", profileData.phoneNumber || "");
      formData.append("location", profileData.location || "");
      formData.append("summary", profileData.summary || "");
      formData.append("title", profileData.title || "");
      
      // Filter empty entries before sending
      const skills = (profileData.skills || []).filter((s: string) => s && s.trim());
      const experiences = (profileData.experiences || []).filter((e: any) => e && (e.title?.trim() || e.company?.trim()));
      const education = (profileData.education || []).filter((e: any) => e && (e.institution?.trim() || e.degree?.trim()));
      
      formData.append("skills", JSON.stringify(skills));
      formData.append("experiences", JSON.stringify(experiences));
      formData.append("education", JSON.stringify(education));

      // NOTE: Image is uploaded separately via handleProfileImageChange
      // Do NOT include profilePicture in this request - it's handled by POST /upload-photo
      
      console.log("📤 FormData entries (text fields only):");
      for (let [key, value] of formData.entries()) {
        const preview = typeof value === 'string' ? value.substring(0, 50) : value;
        console.log(`  - ${key}:`, preview);
      }

      const response = await handleTalentProfileUpdate(formData);

      if (response.success) {
        toast.success(response.message || "Profile updated successfully!");
        router.push("/talent/profile");
        router.refresh();
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "An error occurred while updating your profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Edit Your Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Profile Picture
            </h2>
            <div className="flex items-center gap-8">
              {/* Preview */}
              <div className="flex-shrink-0">
                <div className="h-32 w-32 rounded-lg bg-blue-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-gray-300 dark:border-gray-600 overflow-hidden">
                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{profileData.fname?.[0] || "T"}{profileData.lname?.[0] || "U"}</span>
                  )}
                </div>
              </div>

              {/* Upload Input */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload New Picture (JPG, PNG, GIF)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleProfileImageChange}
                    className="hidden"
                    id="profile-image-input"
                  />
                  <label
                    htmlFor="profile-image-input"
                    className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                  >
                    <Upload className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {profileImageFile ? profileImageFile.name : "Click to upload image"}
                    </span>
                  </label>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Max file size: 2MB. Supported formats: JPG, PNG, GIF
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={profileData.fname || ""}
                  onChange={(e) => handleInputChange(e, "fname")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profileData.lname || ""}
                  onChange={(e) => handleInputChange(e, "lname")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white opacity-50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profileData.phoneNumber || ""}
                  onChange={(e) => handleInputChange(e, "phoneNumber")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={profileData.location || ""}
                onChange={(e) => handleInputChange(e, "location")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Professional Title
              </label>
              <input
                type="text"
                value={profileData.title || ""}
                onChange={(e) => handleInputChange(e, "title")}
                placeholder="e.g., Full Stack Developer | React & Node.js Expert"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Professional Summary
              </label>
              <textarea
                value={profileData.summary || ""}
                onChange={(e) => handleInputChange(e, "summary")}
                rows={4}
                placeholder="Tell us about yourself..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Skills
              </h2>
              <button
                type="button"
                onClick={handleAddSkill}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Skill
              </button>
            </div>
            <div className="space-y-2">
              {(profileData.skills || []).map((skill, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    placeholder="e.g., JavaScript, React, Node.js"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Experience
              </h2>
              <button
                type="button"
                onClick={handleAddExperience}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Experience
              </button>
            </div>
            <div className="space-y-4">
              {(profileData.experiences || []).map((exp, index) => (
                <div key={index} className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) =>
                          handleExperienceChange(index, "title", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) =>
                          handleExperienceChange(index, "company", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Period
                      </label>
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) =>
                          handleExperienceChange(index, "period", e.target.value)
                        }
                        placeholder="e.g., Jan 2020 - Dec 2022"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={exp.location || ""}
                        onChange={(e) =>
                          handleExperienceChange(index, "location", e.target.value)
                        }
                        placeholder="e.g., New York, USA"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={exp.description || ""}
                      onChange={(e) =>
                        handleExperienceChange(index, "description", e.target.value)
                      }
                      rows={3}
                      placeholder="Describe your responsibilities and achievements..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(index)}
                      className="flex items-center text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5 mr-1" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Education
              </h2>
              <button
                type="button"
                onClick={handleAddEducation}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Education
              </button>
            </div>
            <div className="space-y-4">
              {(profileData.education || []).map((edu, index) => (
                <div key={index} className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Institution
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) =>
                          handleEducationChange(index, "institution", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Degree
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) =>
                          handleEducationChange(index, "degree", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Period
                      </label>
                      <input
                        type="text"
                        value={edu.period}
                        onChange={(e) =>
                          handleEducationChange(index, "period", e.target.value)
                        }
                        placeholder="e.g., 2018 - 2022"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(index)}
                      className="text-red-600 hover:text-red-700 mb-0"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-md transition"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
