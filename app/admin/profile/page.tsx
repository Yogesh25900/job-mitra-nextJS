"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Calendar, Shield, Edit2, Save, X } from "lucide-react";
import Link from "next/link";
import { handleUpdateAdminProfile } from "@/lib/actions/admin/admin-actions";

interface AdminProfile {
  _id?: string;
  fname: string;
  lname: string;
  email: string;
  phone?: string;
  location?: string;
  createdAt?: string;
  role: string;
}

export default function AdminProfilePage() {
  const { user, isAuthenticated, setUser, refetchAuth } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState<AdminProfile>({
    fname: user?.fname || "",
    lname: user?.lname || "",
    email: user?.email || "",
    phone: user?.phoneNumber || user?.phone || "",
    location: user?.location || "",
    role: "admin",
  });
  const [originalData, setOriginalData] = useState<AdminProfile>(formData);

  const shouldRedirectToLogin = !isAuthenticated || !user || user.role !== "admin";

  useEffect(() => {
    if (shouldRedirectToLogin) {
      router.replace("/admin/login");
    }
  }, [shouldRedirectToLogin, router]);

  // Redirect if not authenticated or not an admin
  if (shouldRedirectToLogin) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrorMessage("");
    setSuccessMessage("");
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.fname.trim() || !formData.lname.trim()) {
      setErrorMessage("First name and last name are required.");
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage("Email is required.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await handleUpdateAdminProfile({
        fname: formData.fname.trim(),
        lname: formData.lname.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phone?.trim() || "",
        location: formData.location?.trim() || "",
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to update profile");
      }

      if (response.data) {
        const updatedFormData: AdminProfile = {
          _id: response.data._id,
          fname: response.data.fname || "",
          lname: response.data.lname || "",
          email: response.data.email || "",
          phone: response.data.phoneNumber || "",
          location: response.data.location || "",
          createdAt: response.data.createdAt,
          role: response.data.role || "admin",
        };

        setFormData(updatedFormData);
        setOriginalData(updatedFormData);
        setUser({ ...user, ...response.data });
      }

      await refetchAuth();
      setSuccessMessage(response.message || "Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setFormData(originalData);
    setIsEditing(false);
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-full bg-white dark:bg-slate-950 transition-colors duration-200">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
        <div className="px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
           
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Profile
              </h1>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                Manage your admin account settings
              </p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800">
          {/* Profile Header */}
          <div className="px-6 py-8 border-b border-gray-200 dark:border-slate-800">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {formData.fname.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formData.fname} {formData.lname}
                </h2>
                <p className="text-gray-600 dark:text-slate-400 mt-1 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Administrator
                </p>
                <p className="text-sm text-gray-700 dark:text-slate-300 mt-3">
                  Member since {formatDate(user?.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-6 py-8">
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm">
                {successMessage}
              </div>
            )}
            {isEditing ? (
              // Edit Form
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="fname"
                      value={formData.fname}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lname"
                      value={formData.lname}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter location"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-slate-600 transition-colors font-medium"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-300 dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-slate-700 transition-colors font-medium"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-slate-400">
                      Full Name
                    </label>
                    <p className="text-lg text-gray-900 dark:text-white mt-1">
                      {formData.fname} {formData.lname}
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-slate-400 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <p className="text-lg text-gray-900 dark:text-white mt-1 break-all">
                      {formData.email}
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Phone */}
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-slate-400 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </label>
                    <p className="text-lg text-gray-900 dark:text-white mt-1">
                      {formData.phone || "Not provided"}
                    </p>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-slate-400 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </label>
                    <p className="text-lg text-gray-900 dark:text-white mt-1">
                      {formData.location || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Account Information */}
          <div className="px-6 py-8 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 rounded-b-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-violet-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Role</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formData.role === "admin" ? "Platform Administrator" : formData.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-violet-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Member Since</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(user?.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
