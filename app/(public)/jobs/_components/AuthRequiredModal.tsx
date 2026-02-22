"use client"

interface AuthRequiredModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: () => void
  onRegister: () => void
}

export default function AuthRequiredModal({
  isOpen,
  onClose,
  onLogin,
  onRegister,
}: AuthRequiredModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl px-6 py-7 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-2xl">lock</span>
        </div>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Sign In Required
        </h3>

        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
          To apply for this position and unlock personalized job recommendations, please sign in to your JobMitra account.
        </p>

        <p className="text-sm text-primary font-medium mb-5">
          New here? Creating an account takes less than a minute.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onLogin}
            className="w-full py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-95 transition-opacity"
          >
            Login to My Account
          </button>

          <button
            onClick={onRegister}
            className="w-full py-3 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Create New Account
          </button>

          <button
            onClick={onClose}
            className="mt-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  )
}
