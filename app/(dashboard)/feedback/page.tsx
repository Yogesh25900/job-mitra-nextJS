"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import FeedbackModal from "@/components/FeedbackModal";
import DashboardLayout from "@/components/DashboardLayout";

export default function FeedbackPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    router.push("/");
    return null;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Help & Feedback
            </h1>
            <p className="text-gray-600 dark:text-slate-400">
              Report issues, request features, or share your feedback to help us improve
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Share Your Feedback
            </h2>
            <p className="text-gray-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              We value your input! Whether you've encountered a bug, have a feature suggestion, 
              or need help with your account, please let us know. Our team reviews all feedback 
              and works to make improvements.
            </p>

            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
            >
              Submit Feedback
            </button>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 p-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🐛</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Report a Bug
              </h3>
              <p className="text-gray-600 dark:text-slate-400 text-sm">
                Found something that isn't working correctly? Report it and help us fix it quickly.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 p-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Request a Feature
              </h3>
              <p className="text-gray-600 dark:text-slate-400 text-sm">
                Have an idea? Let us know what features you'd like to see added to the platform.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 p-6">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">❓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Account Issues
              </h3>
              <p className="text-gray-600 dark:text-slate-400 text-sm">
                Running into problems with your account? Tell us and we'll help you resolve it.
              </p>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Tips for Better Feedback
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li>✓ Be specific about the issue or feature you're discussing</li>
              <li>✓ Include screenshots or attachments if relevant</li>
              <li>✓ Describe the steps to reproduce a bug</li>
              <li>✓ Provide examples of expected vs actual behavior</li>
              <li>✓ Let us know your role (Candidate, Employer, Admin)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSuccess={() => {
          // Optionally handle success
        }}
      />
    </DashboardLayout>
  );
}
