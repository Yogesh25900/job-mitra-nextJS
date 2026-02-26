import React, { useState } from "react";
import { X, Upload, AlertCircle } from "lucide-react";
import { handleSubmitFeedback } from "@/lib/actions/feedback-actions";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function FeedbackModal({
  isOpen,
  onClose,
  onSuccess,
}: FeedbackModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    issueType: "bug" as "bug" | "feature_request" | "account_issue" | "other",
  });

  const [files, setFiles] = useState<{
    screenshot?: File;
    attachment?: File;
  }>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "screenshot" | "attachment"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.subject.trim()) {
      setError("Subject is required");
      return;
    }
    if (formData.subject.trim().length < 5) {
      setError("Subject must be at least 5 characters");
      return;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }
    if (formData.description.trim().length < 10) {
      setError("Description must be at least 10 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData
      const feedbackFormData = new FormData();
      feedbackFormData.append("subject", formData.subject);
      feedbackFormData.append("description", formData.description);
      feedbackFormData.append("issueType", formData.issueType);

      if (files.screenshot) {
        feedbackFormData.append("screenshot", files.screenshot);
      }
      if (files.attachment) {
        feedbackFormData.append("attachment", files.attachment);
      }

      const response = await handleSubmitFeedback(feedbackFormData);

      if (response.success) {
        setSuccess(response.message || "Feedback submitted successfully!");
        setFormData({
          subject: "",
          description: "",
          issueType: "bug",
        });
        setFiles({});

        // Call success callback if provided
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 1500);
        } else {
          // Close modal after 2 seconds
          setTimeout(() => {
            onClose();
          }, 2000);
        }
      } else {
        setError(response.message || "Failed to submit feedback");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting feedback");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4 pt-20">
        <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b dark:border-slate-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Report a Problem
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-slate-300"
              disabled={isLoading}
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="flex-shrink-0 text-red-500 dark:text-red-400 mt-0.5" size={20} />
                <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <AlertCircle className="flex-shrink-0 text-green-500 dark:text-green-400 mt-0.5" size={20} />
                <p className="text-sm text-green-700 dark:text-green-200">{success}</p>
              </div>
            )}

            {/* Issue Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Issue Type <span className="text-red-500">*</span>
              </label>
              <select
                name="issueType"
                value={formData.issueType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="bug">Bug Report</option>
                <option value="feature_request">Feature Request</option>
                <option value="account_issue">Account Issue</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Brief subject of your issue"
                maxLength={200}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.subject.length}/200 characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide detailed information about the issue or feature request"
                maxLength={5000}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                {formData.description.length}/5000 characters
              </p>
            </div>

            {/* Screenshot Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Screenshot (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-6">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
                      {files.screenshot ? (
                        `Selected: ${files.screenshot.name}`
                      ) : (
                        <>
                          Drag and drop your screenshot here, or{" "}
                          <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
                            browse
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleFileChange(e, "screenshot")
                              }
                              className="hidden"
                            />
                          </label>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      JPG, PNG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Attachment Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Attachment (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-6">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
                      {files.attachment ? (
                        `Selected: ${files.attachment.name}`
                      ) : (
                        <>
                          Drag and drop your file here, or{" "}
                          <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
                            browse
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.txt"
                              onChange={(e) =>
                                handleFileChange(e, "attachment")
                              }
                              className="hidden"
                            />
                          </label>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      PDF, DOC, DOCX, TXT up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t dark:border-slate-700">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
