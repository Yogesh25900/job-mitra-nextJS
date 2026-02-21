import React from "react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  candidateName?: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  candidateName,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-8 max-w-sm w-full text-center">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Application?</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Are you sure you want to delete
          {candidateName ? (
            <span className="font-semibold text-red-600 dark:text-red-400"> {candidateName}'s </span>
          ) : (
            ' this '
          )}
          application? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            className="px-5 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
