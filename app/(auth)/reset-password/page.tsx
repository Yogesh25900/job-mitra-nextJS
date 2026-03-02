"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { handleResetPassword } from "@/lib/actions/talent-action";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const userType = (searchParams.get("usertype") || "candidate") as "candidate" | "employer";
  const loginPath = userType === "employer" ? "/recruiter/login" : "/talent/login";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!email) {
      setMessage("Missing email. Please restart the reset flow.");
      setMessageType("error");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setMessage("All fields are required.");
      setMessageType("error");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      setMessageType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      // Call the new handleResetPassword action (no OTP needed - already verified)
      const response = await handleResetPassword(
        email,
        newPassword,
        confirmPassword,
        userType
      );

      if (response.success) {
        setMessage("Password changed successfully! Redirecting to login...");
        setMessageType("success");
        setNewPassword("");
        setConfirmPassword("");
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push(loginPath);
        }, 2000);
      } else {
        setMessage(response.message || "Failed to reset password");
        setMessageType("error");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
    setMessageType("");
  };

  const fields = [
    {
      label: "New Password",
      value: newPassword,
      setValue: setNewPassword,
      show: showNew,
      setShow: setShowNew,
      placeholder: "Enter new password (min. 6 characters)",
    },
    {
      label: "Confirm New Password",
      value: confirmPassword,
      setValue: setConfirmPassword,
      show: showConfirm,
      setShow: setShowConfirm,
      placeholder: "Re-enter new password",
    },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-xl sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Create New Password</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Enter a strong password to secure your account.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {fields.map(({ label, value, setValue, show, setShow, placeholder }) => (
              <label key={label} className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-300">{label}</span>
                <div className="mt-2 flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
                  <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 block bg-transparent p-3 text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none sm:text-sm sm:leading-6"
                  />
                  <button type="button" onClick={() => setShow(!show)} className="px-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white">
                    {show ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
              </label>
            ))}

            {message && (
              <div className={`text-center text-sm rounded-lg p-3 ${
                messageType === "success"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                  : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
              }`}>
                {message}
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 rounded-lg bg-gray-100 dark:bg-gray-700 px-3 py-3 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <a href={loginPath} className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:opacity-80">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
