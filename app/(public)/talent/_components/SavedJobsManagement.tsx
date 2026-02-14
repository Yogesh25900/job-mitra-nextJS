"use client";

import React, { useState, useEffect } from "react";
import { Eye, Trash2, AlertCircle, Loader2, BookmarkX } from "lucide-react";
import toast from "react-hot-toast";
import {
  handleGetSavedJobs,
  handleRemoveSavedJob,
} from "@/lib/actions/saved-jobs-actions";
import Link from "next/link";
import { Job } from "@/lib/types/application";

interface SavedJobsState {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
  selectedJob: Job | null;
  showDeleteModal: boolean;
  isDeleting: boolean;
  currentPage: number;
  totalPages: number;
  total: number;
}

export default function SavedJobsManagement() {
  const [state, setState] = useState<SavedJobsState>({
    jobs: [],
    isLoading: true,
    error: null,
    selectedJob: null,
    showDeleteModal: false,
    isDeleting: false,
    currentPage: 1,
    totalPages: 0,
    total: 0,
  });

  const JOBS_PER_PAGE = 5;

  useEffect(() => {
    fetchSavedJobs(1);
  }, []);

  const fetchSavedJobs = async (page: number) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const result = await handleGetSavedJobs(page, JOBS_PER_PAGE);

    if (result.success) {
      setState((prev) => ({
        ...prev,
        jobs: result.jobs,
        currentPage: page,
        totalPages: result.totalPages,
        total: result.total,
        isLoading: false,
      }));
    } else {
      const errorMsg = result.error || "Failed to fetch saved jobs";
      setState((prev) => ({
        ...prev,
        error: errorMsg,
        isLoading: false,
        jobs: [],
      }));
      toast.error(errorMsg);
    }
  };

  const handleRemoveJob = async (jobId: string) => {
    setState((prev) => ({ ...prev, isDeleting: true }));

    const result = await handleRemoveSavedJob(jobId);

    if (result.success) {
      toast.success("Job removed from saved list");
      setState((prev) => ({
        ...prev,
        showDeleteModal: false,
        selectedJob: null,
        isDeleting: false,
      }));
      // Refresh the list
      fetchSavedJobs(state.currentPage);
    } else {
      toast.error(result.error || "Failed to remove job");
      setState((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const openDeleteModal = (job: Job) => {
    setState((prev) => ({
      ...prev,
      selectedJob: job,
      showDeleteModal: true,
    }));
  };

  const closeDeleteModal = () => {
    setState((prev) => ({
      ...prev,
      showDeleteModal: false,
      selectedJob: null,
    }));
  };

  if (state.isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Loading your saved jobs...
          </p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/20">
        <div className="flex gap-3">
          <AlertCircle className="h-6 w-6 flex-shrink-0 text-red-600 dark:text-red-400" />
          <div>
            <h3 className="font-semibold text-red-800 dark:text-red-300">
              Error Loading Saved Jobs
            </h3>
            <p className="mt-2 text-sm text-red-700 dark:text-red-200">
              {state.error}
            </p>
            <button
              onClick={() => fetchSavedJobs(1)}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state.jobs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-700 dark:bg-slate-900/30">
        <BookmarkX className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600" />
        <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
          No Saved Jobs Yet
        </h3>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Start saving jobs to view them here. Browse jobs and click the save
          button to add them to your saved list.
        </p>
        <Link
          href="/newjob"
          className="mt-4 inline-block rounded-lg bg-primary px-6 py-2 text-white hover:bg-blue-600 transition-colors"
        >
          Browse Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Saved Jobs
          </h2>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            {state.total} job{state.total !== 1 ? "s" : ""} saved
          </p>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
              <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-white">
                Job Title
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-white">
                Company
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-white">
                Location
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-white">
                Type
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-white">
                Level
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-900 dark:text-white">
                Saved
              </th>
              <th className="px-6 py-3 text-center font-semibold text-slate-900 dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {state.jobs.map((job) => (
              <tr
                key={job._id}
                className="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/30"
              >
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  {job.jobTitle}
                </td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                  {job.companyName}
                </td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                  {job.jobLocation}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {job.jobType}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                  {job.experienceLevel}
                </td>
              
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <Link
                      href={`/newjob/details?jobId=${job._id}`}
                      className="inline-flex items-center justify-center rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                      title="View job details"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => openDeleteModal(job)}
                      className="inline-flex items-center justify-center rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
                      title="Remove from saved jobs"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid gap-4 lg:hidden">
        {state.jobs.map((job) => (
          <div
            key={job._id}
            className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50"
          >
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {job.jobTitle}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {job.companyName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-slate-600 dark:text-slate-400">Location</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {job.jobLocation}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400">Type</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {job.jobType}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400">
                    Experience
                  </p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {job.experienceLevel}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400">Saved</p>
                 
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Link
                  href={`/newjob/details?jobId=${job._id}`}
                  className="flex-1 rounded-lg bg-blue-100 py-2 text-center text-sm font-medium text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                >
                  View Details
                </Link>
                <button
                  onClick={() => openDeleteModal(job)}
                  className="flex-1 rounded-lg bg-red-100 py-2 text-center text-sm font-medium text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {state.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => fetchSavedJobs(state.currentPage - 1)}
            disabled={state.currentPage === 1}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900/30 transition-colors"
          >
            Previous
          </button>

          <div className="flex gap-1">
            {Array.from({ length: state.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => fetchSavedJobs(page)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    state.currentPage === page
                      ? "bg-primary text-white"
                      : "border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900/30"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => fetchSavedJobs(state.currentPage + 1)}
            disabled={state.currentPage === state.totalPages}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900/30 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {state.showDeleteModal && state.selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 dark:bg-slate-900 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Remove Saved Job?
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Are you sure you want to remove{" "}
                  <strong>{state.selectedJob.jobTitle}</strong> from your saved
                  jobs? You can save it again anytime.
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                  {state.selectedJob.companyName}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={state.isDeleting}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveJob(state.selectedJob!._id)}
                disabled={state.isDeleting}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
              >
                {state.isDeleting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
