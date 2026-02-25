"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Save, X, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { handleChangeAdminPassword } from "@/lib/actions/admin/admin-actions";

interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  jobAlerts: boolean;
  systemAlerts: boolean;
  weeklyDigest: boolean;
}

export default function AdminSettingsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordForm, setPasswordForm] = useState<SecuritySettings>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      emailNotifications: true,
      jobAlerts: true,
      systemAlerts: true,
      weeklyDigest: false,
    });

  useEffect(() => {
    const root = document.documentElement;
    const storedTheme = localStorage.getItem("theme");

    const isDark =
      storedTheme === "dark" ||
      (storedTheme !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    root.classList.toggle("dark", isDark);
    setDarkMode(isDark);
  }, []);

  // Redirect if not authenticated or not an admin
  if (!isAuthenticated || !user || user.role !== "admin") {
    router.push("/admin/login");
    return null;
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value,
    });
    setPasswordError("");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    // Validation
    if (!passwordForm.currentPassword) {
      setPasswordError("Current password is required");
      return;
    }
    if (!passwordForm.newPassword) {
      setPasswordError("New password is required");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await handleChangeAdminPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to change password");
      }

      setPasswordSuccess(response.message || "Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordSuccess("");
      }, 2000);
    } catch (error) {
      setPasswordError(
        error instanceof Error ? error.message : "Failed to change password"
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key],
    });
  };

  const handleSaveNotifications = async () => {
    try {
      // TODO: Implement API call to save notification settings
      // const response = await fetch("/api/admin/notification-settings", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(notificationSettings),
      // });

      // if (!response.ok) throw new Error("Failed to save settings");

      // Mock success
      alert("Notification settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save notification settings");
    }
  };

  const handleThemeToggle = () => {
    const nextDarkMode = !darkMode;
    const root = document.documentElement;

    root.classList.toggle("dark", nextDarkMode);
    localStorage.setItem("theme", nextDarkMode ? "dark" : "light");
    setDarkMode(nextDarkMode);
  };

  return (
    <div className="min-h-full bg-white dark:bg-slate-950 transition-colors duration-200">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
          
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Settings
              </h1>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Security Settings */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Security
            </h2>
          </div>

          <div className="px-6 py-6">
            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
              >
                Change Password
              </button>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          current: !showPasswords.current,
                        })
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          new: !showPasswords.new,
                        })
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          confirm: !showPasswords.confirm,
                        })
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {passwordError && (
                  <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
                    {passwordError}
                  </div>
                )}

                {/* Success Message */}
                {passwordSuccess && (
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm">
                    {passwordSuccess}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-slate-600 transition-colors font-medium"
                  >
                    <Save className="w-4 h-4" />
                    {isChangingPassword ? "Updating..." : "Update Password"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-300 dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-slate-700 transition-colors font-medium"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

    

        {/* Appearance Settings */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Appearance
            </h2>
          </div>

          <div className="px-6 py-6 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-violet-600' : 'bg-gray-300 dark:bg-slate-700'}`}>
                <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Dark Mode
                </p>
                <p className="text-xs text-gray-600 dark:text-slate-400">
                  {darkMode ? 'Dark theme is enabled' : 'Light theme is enabled'}
                </p>
              </div>
            </label>

            <button
              onClick={handleThemeToggle}
              className="mt-6 flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
