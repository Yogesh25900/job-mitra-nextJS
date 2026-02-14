"use client"; // for Next.js 13+ app directory

import { FC, useState } from "react";

interface ForgotPasswordModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (userType: "candidate" | "employer") => void;
}

const ForgotPasswordModal: FC<ForgotPasswordModalProps> = ({ show, onClose, onSubmit }) => {
  const [userType, setUserType] = useState<"candidate" | "employer" | "">("");

  if (!show) return null;

  const handleSubmit = () => {
    if (!userType) {
      alert("Please select an account type!");
      return;
    }
    onSubmit(userType);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#8c2bee] to-[#8c2bee]/80 px-6 sm:px-8 py-8">
          <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-white/90 text-sm">Which account do you want to reset?</p>
        </div>

        {/* Content */}
        <div className="px-6 sm:px-8 py-8 space-y-4">

          {/* Candidate */}
          <label
            className="flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-[#8c2bee] hover:bg-[#8c2bee]/5"
            style={{
              borderColor: userType === "candidate" ? "#8c2bee" : "#e5e7eb",
              backgroundColor: userType === "candidate" ? "#8c2bee/10" : "transparent",
            }}
          >
            <input
              type="radio"
              name="usertype"
              value="candidate"
              checked={userType === "candidate"}
              onChange={(e) => setUserType(e.target.value as "candidate" | "employer")}
              className="w-5 h-5 cursor-pointer accent-[#8c2bee]"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-white">Talent/Candidate</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Reset your candidate account password</p>
            </div>
          </label>

          {/* Employer */}
          <label
            className="flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-[#8c2bee] hover:bg-[#8c2bee]/5"
            style={{
              borderColor: userType === "employer" ? "#8c2bee" : "#e5e7eb",
              backgroundColor: userType === "employer" ? "#8c2bee/10" : "transparent",
            }}
          >
            <input
              type="radio"
              name="usertype"
              value="employer"
              checked={userType === "employer"}
              onChange={(e) => setUserType(e.target.value as "candidate" | "employer")}
              className="w-5 h-5 cursor-pointer accent-[#8c2bee]"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-white">Recruiter/Employer</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Reset your employer account password</p>
            </div>
          </label>

        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 sm:px-8 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-[#8c2bee] hover:bg-[#7a1dd4] transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
