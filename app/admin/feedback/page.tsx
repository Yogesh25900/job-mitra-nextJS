"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
  Eye,
} from "lucide-react";
import {
  handleGetAdminFeedback,
  handleGetAdminFeedbackStats,
  handleUpdateAdminFeedback,
  handleDeleteAdminFeedback,
} from "@/lib/actions/feedback-actions";

interface Feedback {
  _id: string;
  userName: string;
  userRole: string;
  email: string;
  subject: string;
  description: string;
  issueType: "bug" | "feature_request" | "account_issue" | "other";
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  screenshotPath?: string;
  attachmentPath?: string;
  resolutionNotes?: string;
}

interface Stats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  byType: { [key: string]: number };
  byPriority: { [key: string]: number };
}

export default function AdminFeedbackPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  const [filters, setFilters] = useState({
    status: "",
    issueType: "",
    priority: "",
    search: "",
  });

  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    status: "open",
    priority: "medium",
    resolutionNotes: "",
  });

  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "admin") {
      router.push("/admin/login");
    }
  }, [isAuthenticated, user, router]);

  // Fetch feedback and stats
  const fetchFeedback = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [feedbackRes, statsRes] = await Promise.all([
        handleGetAdminFeedback(currentPage, pageSize, filters),
        handleGetAdminFeedbackStats(),
      ]);

      setFeedbacks(feedbackRes.data || []);
      setTotalPages(feedbackRes.metadata?.pages || 1);
      setStats(statsRes.data);
    } catch (err: any) {
      setError(err.message || "Failed to load feedback");
      console.error("Error loading feedback:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, filters]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const handleStatusChange = (newStatus: string) => {
    setUpdateForm((prev) => ({
      ...prev,
      status: newStatus,
    }));
  };

  const handlePriorityChange = (newPriority: string) => {
    setUpdateForm((prev) => ({
      ...prev,
      priority: newPriority,
    }));
  };

  const handleUpdateSubmit = async () => {
    if (!selectedFeedback) return;

    try {
      await handleUpdateAdminFeedback(selectedFeedback._id, updateForm);
      setIsUpdateModalOpen(false);
      setSelectedFeedback(null);
      fetchFeedback();
    } catch (err: any) {
      setError(err.message || "Failed to update feedback");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) {
      return;
    }

    try {
      await handleDeleteAdminFeedback(id);
      fetchFeedback();
    } catch (err: any) {
      setError(err.message || "Failed to delete feedback");
    }
  };

  const getIssueTypeColor = (type: string) => {
    switch (type) {
      case "bug":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
      case "feature_request":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      case "account_issue":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
      default:
        return "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle size={18} className="text-blue-500" />;
      case "in_progress":
        return <Clock size={18} className="text-amber-500" />;
      case "resolved":
        return <CheckCircle2 size={18} className="text-green-500" />;
      case "closed":
        return <X size={18} className="text-gray-500" />;
      default:
        return null;
    }
  };

  if (!isAuthenticated || !user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Feedback Management
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Manage and respond to user feedback and bug reports
          </p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border dark:border-slate-800">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">Total Feedback</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border dark:border-slate-800">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">Open</p>
              <p className="text-3xl font-bold text-blue-500">{stats.open}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border dark:border-slate-800">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">In Progress</p>
              <p className="text-3xl font-bold text-amber-500">{stats.inProgress}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border dark:border-slate-800">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">Resolved</p>
              <p className="text-3xl font-bold text-green-500">{stats.resolved}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border dark:border-slate-800">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">Closed</p>
              <p className="text-3xl font-bold text-gray-500">{stats.closed}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-lg p-6 mb-8 border dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Issue Type
              </label>
              <select
                value={filters.issueType}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, issueType: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              >
                <option value="">All Types</option>
                <option value="bug">Bug</option>
                <option value="feature_request">Feature Request</option>
                <option value="account_issue">Account Issue</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, priority: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search subject or email..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-slate-400">Loading feedback...</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-slate-400">No feedback found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-slate-800 bg-gray-50 dark:bg-slate-800">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbacks.map((feedback) => (
                      <tr
                        key={feedback._id}
                        className="border-b dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {feedback.subject}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                              {new Date(feedback.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-gray-900 dark:text-white">
                              {feedback.userName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">
                              {feedback.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getIssueTypeColor(
                              feedback.issueType
                            )}`}
                          >
                            {feedback.issueType.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(feedback.status)}
                            <span className="text-sm text-gray-700 dark:text-slate-300">
                              {feedback.status.replace("_", " ")}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                              feedback.priority === "high"
                                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                : feedback.priority === "medium"
                                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                                : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            }`}
                          >
                            {feedback.priority.charAt(0).toUpperCase() + feedback.priority.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedFeedback(feedback);
                                setIsDetailModalOpen(true);
                              }}
                              className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 text-sm font-medium"
                            >
                             <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(feedback._id)}
                              className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t dark:border-slate-800">
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg disabled:opacity-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedFeedback && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsDetailModalOpen(false)}
          />
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Feedback Details
                </h3>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* User Info */}
                <div className="border-b dark:border-slate-700 pb-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    User Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Name</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {selectedFeedback.userName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Role</p>
                      <p className="text-gray-900 dark:text-white font-medium capitalize">
                        {selectedFeedback.userRole}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Email</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {selectedFeedback.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Submitted</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {new Date(selectedFeedback.createdAt).toLocaleDateString()} at{" "}
                        {new Date(selectedFeedback.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feedback Content */}
                <div className="border-b dark:border-slate-700 pb-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Feedback Content
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Subject</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {selectedFeedback.subject}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">
                        Description
                      </p>
                      <p className="text-gray-700 dark:text-slate-300 whitespace-pre-wrap bg-gray-50 dark:bg-slate-800 p-3 rounded-lg">
                        {selectedFeedback.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status & Priority */}
                <div className="border-b dark:border-slate-700 pb-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Status & Priority
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Type</p>
                      <span
                        className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full ${getIssueTypeColor(
                          selectedFeedback.issueType
                        )}`}
                      >
                        {selectedFeedback.issueType.replace("_", " ")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(selectedFeedback.status)}
                        <span className="text-gray-900 dark:text-white capitalize font-medium">
                          {selectedFeedback.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Priority</p>
                      <p
                        className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full capitalize ${
                          selectedFeedback.priority === "high"
                            ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                            : selectedFeedback.priority === "medium"
                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                            : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        }`}
                      >
                        {selectedFeedback.priority}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Attachments */}
                {(selectedFeedback.screenshotPath || selectedFeedback.attachmentPath) && (
                  <div className="border-b dark:border-slate-700 pb-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Attachments
                    </h4>
                    <div className="space-y-2">
                      {selectedFeedback.screenshotPath && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                          <div className="text-blue-500">📸</div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Screenshot
                            </p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">
                              {selectedFeedback.screenshotPath}
                            </p>
                          </div>
                          <a
                            href={`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5050"}/feedback_screenshots/${selectedFeedback.screenshotPath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 text-sm font-medium whitespace-nowrap"
                          >
                            <Eye size={18} className="inline mr-1" />
                            
                          </a>
                        </div>
                      )}
                      {selectedFeedback.attachmentPath && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                          <div className="text-green-500">📎</div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Attachment
                            </p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">
                              {selectedFeedback.attachmentPath}
                            </p>
                          </div>
                          <a
                            href={`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5050"}/feedback_attachments/${selectedFeedback.attachmentPath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 text-sm font-medium whitespace-nowrap"
                          >
                            <Eye size={18} className="inline mr-1" />
                            
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Resolution Notes */}
                {selectedFeedback.resolutionNotes && (
                  <div className="border-b dark:border-slate-700 pb-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Resolution Notes
                    </h4>
                    <p className="text-gray-700 dark:text-slate-300 whitespace-pre-wrap bg-gray-50 dark:bg-slate-800 p-3 rounded-lg">
                      {selectedFeedback.resolutionNotes}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t dark:border-slate-700">
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      setUpdateForm({
                        status: selectedFeedback.status,
                        priority: selectedFeedback.priority,
                        resolutionNotes: selectedFeedback.resolutionNotes || "",
                      });
                      setIsUpdateModalOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Update Feedback
                  </button>
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {isUpdateModalOpen && selectedFeedback && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsUpdateModalOpen(false)}
          />
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-lg shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Update Feedback
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Status
                  </label>
                  <select
                    value={updateForm.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={updateForm.priority}
                    onChange={(e) => handlePriorityChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Resolution Notes
                  </label>
                  <textarea
                    value={updateForm.resolutionNotes}
                    onChange={(e) =>
                      setUpdateForm((prev) => ({
                        ...prev,
                        resolutionNotes: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white resize-none"
                    rows={4}
                    placeholder="Add resolution notes..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 mt-6 pt-4 border-t dark:border-slate-700">
                <button
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSubmit}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
