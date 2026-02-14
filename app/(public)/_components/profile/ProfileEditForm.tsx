"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { handleGetTalentProfileById, handleTalentProfileUpdate, handleGetRecruiterProfileById, handleRecruiterProfileUpdate } from "@/lib/actions/auth-action";
import type { ProfileRole } from "./ProfileView";

interface TalentProfileFormState {
  fname: string;
  lname: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  location: string;
  title: string;
  summary: string;
  skills: string;
  linkedin: string;
  github: string;
  portfolio: string;
  experiences: Array<{
    title: string;
    company: string;
    period: string;
    location?: string;
    description?: string;
    isCurrent?: boolean;
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
  portfolioItems: Array<{
    title: string;
    portfolioLink: string;
  }>;
}

interface RecruiterProfileFormState {
  companyName: string;
  contactName: string;
  email: string;
  phoneNumber: string;
}

interface ProfileEditFormProps {
  role: ProfileRole;
  viewPath: string;
}

const emptyTalentState: TalentProfileFormState = {
  fname: "",
  lname: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
  location: "",
  title: "",
  summary: "",
  skills: "",
  linkedin: "",
  github: "",
  portfolio: "",
  experiences: [],
  education: [],
  certifications: [],
  portfolioItems: [],
};

const emptyRecruiterState: RecruiterProfileFormState = {
  companyName: "",
  contactName: "",
  email: "",
  phoneNumber: "",
};

export default function ProfileEditForm({ role, viewPath }: ProfileEditFormProps) {
  const { user, isAuthenticated, loading, setUser } = useAuth();
  const router = useRouter();
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [talentForm, setTalentForm] = useState<TalentProfileFormState>(emptyTalentState);
  const [recruiterForm, setRecruiterForm] = useState<RecruiterProfileFormState>(emptyRecruiterState);

  const isTalent = role === "talent";

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("Please log in to edit your profile");
      router.push("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        setError(null);
        if (isAuthenticated && !loading) {
          const response = isTalent
            ? await handleGetTalentProfileById()
            : await handleGetRecruiterProfileById();

          const data = response.success ? response.data : user;

          if (data) {
            if (isTalent) {
              setTalentForm({
                fname: data.fname || "",
                lname: data.lname || "",
                email: data.email || "",
                phoneNumber: data.phoneNumber || "",
                dateOfBirth: data.dateOfBirth || "",
                location: data.location || "",
                title: data.title || "",
                summary: data.summary || "",
                skills: Array.isArray(data.skills) ? data.skills.join(", ") : "",
                linkedin: data.links?.linkedin || "",
                github: data.links?.github || "",
                portfolio: data.links?.portfolio || "",
                experiences: Array.isArray(data.experiences) ? data.experiences : [],
                education: Array.isArray(data.education) ? data.education : [],
                certifications: Array.isArray(data.certifications) ? data.certifications : [],
                portfolioItems: Array.isArray(data.portfolio)
                  ? data.portfolio.map((item: any) => ({
                      title: item?.title || "",
                      portfolioLink: item?.portfolioLink || "",
                    }))
                  : [],
              });
            } else {
              setRecruiterForm({
                companyName: data.companyName || "",
                contactName: data.contactName || "",
                email: data.email || "",
                phoneNumber: data.phoneNumber || "",
              });
            }
          } else {
            setError(response.message || "Unable to load profile data");
          }
        }
      } catch (err: any) {
        console.error("Failed to fetch profile:", err);
        setError(err?.message || "Unable to load profile data");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (isAuthenticated && !loading) {
      loadProfile();
    }
  }, [isAuthenticated, isTalent, loading, router, user]);

  const saveDisabled = useMemo(() => isSaving || loading || isLoadingProfile, [isSaving, loading, isLoadingProfile]);

  const handleTalentChange = (field: keyof TalentProfileFormState, value: string) => {
    setTalentForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRecruiterChange = (field: keyof RecruiterProfileFormState, value: string) => {
    setRecruiterForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (isTalent) {
      if (!talentForm.fname.trim() || !talentForm.lname.trim() || !talentForm.email.trim()) {
        setError("First name, last name, and email are required.");
        return false;
      }
    } else {
      if (!recruiterForm.companyName.trim() || !recruiterForm.contactName.trim() || !recruiterForm.email.trim()) {
        setError("Company name, contact name, and email are required.");
        return false;
      }
    }
    setError(null);
    return true;
  };

  const buildTalentFormData = () => {
    const formData = new FormData();
    formData.append("fname", talentForm.fname.trim());
    formData.append("lname", talentForm.lname.trim());
    formData.append("email", talentForm.email.trim());
    formData.append("phoneNumber", talentForm.phoneNumber.trim());
    formData.append("dateOfBirth", talentForm.dateOfBirth.trim());
    formData.append("location", talentForm.location.trim());
    formData.append("title", talentForm.title.trim());
    formData.append("summary", talentForm.summary.trim());

    const skillsArray = talentForm.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (skillsArray.length > 0) {
      formData.append("skills", JSON.stringify(skillsArray));
    }

    const links = {
      linkedin: talentForm.linkedin.trim(),
      github: talentForm.github.trim(),
      portfolio: talentForm.portfolio.trim(),
    };

    if (links.linkedin || links.github || links.portfolio) {
      formData.append("links", JSON.stringify(links));
    }

    if (talentForm.experiences.length > 0) {
      formData.append("experiences", JSON.stringify(talentForm.experiences));
    }

    if (talentForm.education.length > 0) {
      formData.append("education", JSON.stringify(talentForm.education));
    }

    if (talentForm.certifications.length > 0) {
      formData.append("certifications", JSON.stringify(talentForm.certifications));
    }

    if (talentForm.portfolioItems.length > 0) {
      const formattedPortfolio = talentForm.portfolioItems.map((item, index) => ({
        id: `${Date.now()}-${index}`,
        title: item.title,
        portfolioLink: item.portfolioLink,
        image: "",
      }));
      formData.append("portfolio", JSON.stringify(formattedPortfolio));
    }

    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    return formData;
  };

  const buildRecruiterFormData = () => {
    const formData = new FormData();
    formData.append("companyName", recruiterForm.companyName.trim());
    formData.append("contactName", recruiterForm.contactName.trim());
    formData.append("email", recruiterForm.email.trim());
    formData.append("phoneNumber", recruiterForm.phoneNumber.trim());
    return formData;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      const result = isTalent
        ? await handleTalentProfileUpdate(buildTalentFormData())
        : await handleRecruiterProfileUpdate(buildRecruiterFormData());

      if (result.success) {
        toast.success("Profile updated successfully");
        if (result.data) {
          setUser((prev: any) => ({
            ...prev,
            ...result.data,
          }));
        }
        router.push(viewPath);
        router.refresh();
      } else {
        toast.error(result.message || "Profile update failed");
      }
    } catch (err: any) {
      console.error("Profile update error:", err);
      toast.error(err?.message || "Profile update failed");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Edit Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base mt-1">
            Update your profile details
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push(viewPath)}
          className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm font-semibold"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        {isTalent ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">First Name</label>
              <input
                type="text"
                value={talentForm.fname}
                onChange={(e) => handleTalentChange("fname", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Last Name</label>
              <input
                type="text"
                value={talentForm.lname}
                onChange={(e) => handleTalentChange("lname", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
              <input
                type="email"
                value={talentForm.email}
                disabled
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 px-3 py-2 text-sm text-slate-500 dark:text-slate-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Phone Number</label>
              <input
                type="tel"
                value={talentForm.phoneNumber}
                onChange={(e) => handleTalentChange("phoneNumber", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Date of Birth</label>
              <input
                type="date"
                value={talentForm.dateOfBirth}
                onChange={(e) => handleTalentChange("dateOfBirth", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Location</label>
              <input
                type="text"
                value={talentForm.location}
                onChange={(e) => handleTalentChange("location", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Title</label>
              <input
                type="text"
                value={talentForm.title}
                onChange={(e) => handleTalentChange("title", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Summary</label>
              <textarea
                value={talentForm.summary}
                onChange={(e) => handleTalentChange("summary", e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Skills (comma separated)</label>
              <input
                type="text"
                value={talentForm.skills}
                onChange={(e) => handleTalentChange("skills", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Resume (PDF/DOC)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-600 dark:text-slate-300"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">LinkedIn</label>
              <input
                type="url"
                value={talentForm.linkedin}
                onChange={(e) => handleTalentChange("linkedin", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">GitHub</label>
              <input
                type="url"
                value={talentForm.github}
                onChange={(e) => handleTalentChange("github", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Portfolio</label>
              <input
                type="url"
                value={talentForm.portfolio}
                onChange={(e) => handleTalentChange("portfolio", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div className="md:col-span-2 grid grid-cols-1 gap-6">
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Experience</h3>
                  <button
                    type="button"
                    className="text-xs text-primary font-semibold"
                    onClick={() =>
                      setTalentForm((prev) => ({
                        ...prev,
                        experiences: [
                          ...prev.experiences,
                          { title: "", company: "", period: "", location: "", description: "", isCurrent: false },
                        ],
                      }))
                    }
                  >
                    Add Experience
                  </button>
                </div>
                {talentForm.experiences.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No experience added.</p>
                ) : (
                  <div className="space-y-4">
                    {talentForm.experiences.map((exp, index) => (
                      <div key={`exp-${index}`} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Title"
                          value={exp.title}
                          onChange={(e) => {
                            const updated = [...talentForm.experiences];
                            updated[index] = { ...updated[index], title: e.target.value };
                            setTalentForm((prev) => ({ ...prev, experiences: updated }));
                          }}
                          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...talentForm.experiences];
                            updated[index] = { ...updated[index], company: e.target.value };
                            setTalentForm((prev) => ({ ...prev, experiences: updated }));
                          }}
                          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Period"
                          value={exp.period}
                          onChange={(e) => {
                            const updated = [...talentForm.experiences];
                            updated[index] = { ...updated[index], period: e.target.value };
                            setTalentForm((prev) => ({ ...prev, experiences: updated }));
                          }}
                          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Location"
                          value={exp.location || ""}
                          onChange={(e) => {
                            const updated = [...talentForm.experiences];
                            updated[index] = { ...updated[index], location: e.target.value };
                            setTalentForm((prev) => ({ ...prev, experiences: updated }));
                          }}
                          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
                        />
                        <textarea
                          placeholder="Description"
                          value={exp.description || ""}
                          onChange={(e) => {
                            const updated = [...talentForm.experiences];
                            updated[index] = { ...updated[index], description: e.target.value };
                            setTalentForm((prev) => ({ ...prev, experiences: updated }));
                          }}
                          rows={3}
                          className="md:col-span-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
                        />
                        <div className="md:col-span-2 flex justify-end">
                          <button
                            type="button"
                            className="text-xs text-red-500"
                            onClick={() => {
                              setTalentForm((prev) => ({
                                ...prev,
                                experiences: prev.experiences.filter((_, i) => i !== index),
                              }));
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Education</h3>
                  <button
                    type="button"
                    className="text-xs text-primary font-semibold"
                    onClick={() =>
                      setTalentForm((prev) => ({
                        ...prev,
                        education: [...prev.education, { degree: "", institution: "", period: "" }],
                      }))
                    }
                  >
                    Add Education
                  </button>
                </div>
                {talentForm.education.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No education added.</p>
                ) : (
                  <div className="space-y-4">
                    {talentForm.education.map((edu, index) => (
                      <div key={`edu-${index}`} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Degree"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...talentForm.education];
                            updated[index] = { ...updated[index], degree: e.target.value };
                            setTalentForm((prev) => ({ ...prev, education: updated }));
                          }}
                          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Institution"
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = [...talentForm.education];
                            updated[index] = { ...updated[index], institution: e.target.value };
                            setTalentForm((prev) => ({ ...prev, education: updated }));
                          }}
                          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Period"
                          value={edu.period}
                          onChange={(e) => {
                            const updated = [...talentForm.education];
                            updated[index] = { ...updated[index], period: e.target.value };
                            setTalentForm((prev) => ({ ...prev, education: updated }));
                          }}
                          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
                        />
                        <div className="md:col-span-3 flex justify-end">
                          <button
                            type="button"
                            className="text-xs text-red-500"
                            onClick={() => {
                              setTalentForm((prev) => ({
                                ...prev,
                                education: prev.education.filter((_, i) => i !== index),
                              }));
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Certifications</h3>
                  <button
                    type="button"
                    className="text-xs text-primary font-semibold"
                    onClick={() =>
                      setTalentForm((prev) => ({
                        ...prev,
                        certifications: [...prev.certifications, { name: "", issuer: "" }],
                      }))
                    }
                  >
                    Add Certification
                  </button>
                </div>
                {talentForm.certifications.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No certifications added.</p>
                ) : (
                  <div className="space-y-4">
                    {talentForm.certifications.map((cert, index) => (
                      <div key={`cert-${index}`} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Certification"
                          value={cert.name}
                          onChange={(e) => {
                            const updated = [...talentForm.certifications];
                            updated[index] = { ...updated[index], name: e.target.value };
                            setTalentForm((prev) => ({ ...prev, certifications: updated }));
                          }}
                          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Issuer"
                          value={cert.issuer}
                          onChange={(e) => {
                            const updated = [...talentForm.certifications];
                            updated[index] = { ...updated[index], issuer: e.target.value };
                            setTalentForm((prev) => ({ ...prev, certifications: updated }));
                          }}
                          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
                        />
                        <div className="md:col-span-2 flex justify-end">
                          <button
                            type="button"
                            className="text-xs text-red-500"
                            onClick={() => {
                              setTalentForm((prev) => ({
                                ...prev,
                                certifications: prev.certifications.filter((_, i) => i !== index),
                              }));
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Portfolio Items</h3>
                  <button
                    type="button"
                    className="text-xs text-primary font-semibold"
                    onClick={() =>
                      setTalentForm((prev) => ({
                        ...prev,
                        portfolioItems: [...prev.portfolioItems, { title: "", portfolioLink: "" }],
                      }))
                    }
                  >
                    Add Item
                  </button>
                </div>
                {talentForm.portfolioItems.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No portfolio items added.</p>
                ) : (
                  <div className="space-y-4">
                    {talentForm.portfolioItems.map((item, index) => (
                      <div key={`portfolio-${index}`} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Title"
                          value={item.title}
                          onChange={(e) => {
                            const updated = [...talentForm.portfolioItems];
                            updated[index] = { ...updated[index], title: e.target.value };
                            setTalentForm((prev) => ({ ...prev, portfolioItems: updated }));
                          }}
                          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
                        />
                        <input
                          type="url"
                          placeholder="Link"
                          value={item.portfolioLink}
                          onChange={(e) => {
                            const updated = [...talentForm.portfolioItems];
                            updated[index] = { ...updated[index], portfolioLink: e.target.value };
                            setTalentForm((prev) => ({ ...prev, portfolioItems: updated }));
                          }}
                          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
                        />
                        <div className="md:col-span-2 flex justify-end">
                          <button
                            type="button"
                            className="text-xs text-red-500"
                            onClick={() => {
                              setTalentForm((prev) => ({
                                ...prev,
                                portfolioItems: prev.portfolioItems.filter((_, i) => i !== index),
                              }));
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Company Name</label>
              <input
                type="text"
                value={recruiterForm.companyName}
                onChange={(e) => handleRecruiterChange("companyName", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Contact Name</label>
              <input
                type="text"
                value={recruiterForm.contactName}
                onChange={(e) => handleRecruiterChange("contactName", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
              <input
                type="email"
                value={recruiterForm.email}
                disabled
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 px-3 py-2 text-sm text-slate-500 dark:text-slate-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Phone Number</label>
              <input
                type="tel"
                value={recruiterForm.phoneNumber}
                onChange={(e) => handleRecruiterChange("phoneNumber", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={saveDisabled}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
