"use client"

import { AlertTriangle, Loader2 } from 'lucide-react'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading?: boolean
  applicationTitle: string
  companyName: string
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  applicationTitle,
  companyName
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header with Warning Icon */}
        <div className="flex items-center justify-center pt-6 pb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 text-center">
          <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-2">
            Delete Application?
          </h2>
          
          <p className="text-sm text-[#617589] dark:text-gray-400 mb-4">
            Are you sure you want to delete your application for:
          </p>

          {/* Application Details */}
          <div className="bg-[#f6f7f8] dark:bg-slate-700/50 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-[#0d141b] dark:text-white mb-1">
              {applicationTitle}
            </p>
            <p className="text-xs text-[#617589] dark:text-gray-400">
              {companyName}
            </p>
          </div>

          <p className="text-xs text-[#617589] dark:text-gray-400 mb-6">
            This action cannot be undone. You can apply again later if interested.
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-[#d0d8e0] dark:border-slate-700 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-[#f6f7f8] dark:bg-slate-700 text-[#111418] dark:text-white rounded-lg font-semibold hover:bg-[#e0e4e8] dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Keep Application
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 dark:hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              'Delete Application'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
