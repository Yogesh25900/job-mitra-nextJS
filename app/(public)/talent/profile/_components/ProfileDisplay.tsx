"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Mail, Phone, MapPin, Calendar, Briefcase, Award, Code, ExternalLink, ChevronRight } from "lucide-react";
import { handleGetTalentProfileById } from "@/lib/actions/auth-action";

interface ProfileData {
  _id: string;
  fname?: string;
  lname?: string;
  email: string;
  phoneNumber?: string;
  location?: string;
  summary?: string;
  profilePicturePath?: string;
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
  createdAt?: string;
}

export default function ProfileDisplay() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("Please log in to view your profile");
      router.push("/login");
      return;
    }

    const fetchProfileData = async () => {
      try {
        if (isAuthenticated && !loading) {
          const response = await handleGetTalentProfileById();
          console.log("📊 Fetched profile data:", response);
          console.log("📊 Profile picture path:", response?.data?.profilePicturePath);
          if (response.success && response.data) {
            console.log("✅ Setting profile data from API response");
            setProfileData(response.data);
          } else if (user) {
            console.log("⚠️ Setting profile data from user context");
            setProfileData(user);
          }
        }
      } catch (error) {
        console.error("❌ Failed to fetch profile:", error);
        if (user) {
          console.log("📊 Setting profile data from user context due to error");
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 opacity-20 blur-xl animate-pulse"></div>
          <div className="relative animate-spin rounded-full h-14 w-14 border-2 border-transparent border-t-cyan-400 border-r-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
        <div className="text-center">
          <div className="text-6xl mb-4">∅</div>
          <h1 className="text-2xl font-light text-slate-100 mb-2">No Profile Data</h1>
          <p className="text-slate-400 font-light">Unable to load your profile. Please try again.</p>
        </div>
      </div>
    );
  }

  const initials = `${profileData.fname?.[0] || "T"}${profileData.lname?.[0] || "U"}`.toUpperCase();
  const profileImageUrl = profileData.profilePicturePath 
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile_pictures/${profileData.profilePicturePath}` 
    : null;
  
  console.log("🖼️ Profile image URL:", profileImageUrl);
  console.log("🖼️ Profile data:", { fname: profileData.fname, lname: profileData.lname, profilePicturePath: profileData.profilePicturePath });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }

        .display-font {
          font-family: 'Playfair Display', serif;
        }

        .gradient-accent {
          background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
        }

        .card-glow {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(148, 163, 184, 0.2);
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .section-reveal {
          animation: slideInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .section-reveal:nth-child(1) { animation-delay: 0.1s; }
        .section-reveal:nth-child(2) { animation-delay: 0.2s; }
        .section-reveal:nth-child(3) { animation-delay: 0.3s; }
        .section-reveal:nth-child(4) { animation-delay: 0.4s; }
        .section-reveal:nth-child(5) { animation-delay: 0.5s; }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .skill-tag {
          animation: scaleIn 0.3s ease-out;
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .skill-tag:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(6, 182, 212, 0.2);
        }

        .icon-glow {
          transition: all 0.3s ease;
        }

        .contact-item:hover .icon-glow {
          filter: drop-shadow(0 0 8px rgba(6, 182, 212, 0.6));
          transform: scale(1.1);
        }

        .experience-item {
          transition: all 0.3s ease;
          padding: 1.5rem;
          border-radius: 0.75rem;
          background: rgba(30, 41, 59, 0.5);
        }

        .experience-item:hover {
          background: rgba(51, 65, 85, 0.6);
          border-left: 3px solid #06b6d4;
          padding-left: calc(1.5rem - 3px);
          transform: translateX(2px);
        }

        .button-hover {
          position: relative;
          overflow: hidden;
        }

        .button-hover::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .button-hover:hover::before {
          width: 300px;
          height: 300px;
        }

        .button-hover > * {
          position: relative;
          z-index: 1;
        }

        .divider-accent {
          height: 1px;
          background: linear-gradient(90deg, rgba(148, 163, 184, 0), rgba(6, 182, 212, 0.5), rgba(148, 163, 184, 0));
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Header */}
        <div className="section-reveal mb-12">
          
            {/* Profile Content */}
            <div className="px-8 pb-8 pt-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-8 -mt-24 mb-8">
                {/* Avatar */}
                <div className="flex-shrink-0 relative group">
                  <div className="h-40 w-40 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 p-1 shadow-2xl">
                    <div className="h-full w-full rounded-2xl bg-slate-900 flex items-center justify-center overflow-hidden relative">
                      {profileImageUrl ? (
                        <img
                          src={profileImageUrl}
                          alt={`${profileData.fname} ${profileData.lname}`}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            console.error("❌ Image failed to load from:", profileImageUrl);
                            (e.target as HTMLImageElement).style.display = 'none';
                            // Show fallback initials
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent && !parent.querySelector('.fallback-initials')) {
                              const span = document.createElement('span');
                              span.className = 'fallback-initials text-5xl font-bold bg-gradient-to-br from-cyan-400 to-blue-500 bg-clip-text text-transparent';
                              span.textContent = initials;
                              parent.appendChild(span);
                            }
                          }}
                          onLoad={() => {
                            console.log("✅ Image loaded successfully from:", profileImageUrl);
                          }}
                        />
                      ) : (
                        <span className="text-5xl font-bold bg-gradient-to-br from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                          {initials}
                        </span>
                      )}
                      
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 pt-12">
                  <h1 className="display-font text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                    {profileData.fname} {profileData.lname}
                  </h1>
                  {profileData.title && (
                    <p className="text-xl text-cyan-300 font-light mb-4">
                      {profileData.title}
                    </p>
                  )}
                  {profileData.summary && (
                    <p className="text-slate-300 font-light leading-relaxed max-w-2xl text-base">
                      {profileData.summary}
                    </p>
                  )}
                </div>

                {/* Edit Button */}
                <div className="flex-shrink-0 pt-12">
                  <button
                    onClick={() => router.push("/talent/profile/edit")}
                    className="button-hover gradient-accent text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 flex items-center gap-2"
                  >
                    Edit Profile
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Contact Information */}
              <div className="divider-accent mb-8"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {profileData.email && (
                  <div className="contact-item">
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-cyan-400 icon-glow mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Email</p>
                        <p className="text-slate-200 font-light break-all text-sm mt-1">
                          {profileData.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {profileData.phoneNumber && (
                  <div className="contact-item">
                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-cyan-400 icon-glow mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Phone</p>
                        <p className="text-slate-200 font-light text-sm mt-1">
                          {profileData.phoneNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {profileData.location && (
                  <div className="contact-item">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-cyan-400 icon-glow mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Location</p>
                        <p className="text-slate-200 font-light text-sm mt-1">
                          {profileData.location}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {profileData.createdAt && (
                  <div className="contact-item">
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-cyan-400 icon-glow mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Since</p>
                        <p className="text-slate-200 font-light text-sm mt-1">
                          {new Date(profileData.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        {profileData.skills && profileData.skills.length > 0 && (
          <div className="section-reveal">
            <div className="card-glow rounded-2xl p-8 mb-8">
              <div className="flex items-center gap-3 mb-8">
                <Code className="h-6 w-6 text-cyan-400" />
                <h2 className="display-font text-3xl font-bold">Skills</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="skill-tag bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-100 px-5 py-2.5 rounded-full text-sm font-medium hover:border-cyan-400 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Experience Section */}
        {profileData.experiences && profileData.experiences.length > 0 && (
          <div className="section-reveal">
            <div className="card-glow rounded-2xl p-8 mb-8">
              <div className="flex items-center gap-3 mb-8">
                <Briefcase className="h-6 w-6 text-cyan-400" />
                <h2 className="display-font text-3xl font-bold">Experience</h2>
              </div>
              <div className="space-y-4">
                {profileData.experiences.map((exp, index) => (
                  <div key={index} className="experience-item">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-slate-100">
                        {exp.title}
                      </h3>
                      {exp.isCurrent && (
                        <span className="text-xs bg-cyan-500/30 border border-cyan-500/50 text-cyan-200 px-3 py-1 rounded-full font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-cyan-400 font-medium text-sm">{exp.company}</p>
                    <p className="text-slate-400 font-light text-xs mt-1">{exp.period}</p>
                    {exp.description && (
                      <p className="text-slate-300 font-light mt-3 leading-relaxed text-sm">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Education Section */}
        {profileData.education && profileData.education.length > 0 && (
          <div className="section-reveal">
            <div className="card-glow rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <Award className="h-6 w-6 text-cyan-400" />
                <h2 className="display-font text-3xl font-bold">Education</h2>
              </div>
              <div className="space-y-4">
                {profileData.education.map((edu, index) => (
                  <div key={index} className="experience-item">
                    <h3 className="text-lg font-semibold text-slate-100">
                      {edu.institution}
                    </h3>
                    <p className="text-cyan-400 font-medium text-sm mt-1">{edu.degree}</p>
                    <p className="text-slate-400 font-light text-xs mt-2">{edu.period}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
  );
}