'use client'

export default function TalentMessagesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Messages
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base mt-1">
          Chat with employers and recruiters
        </p>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center">
        <span className="material-symbols-outlined text-[48px] text-slate-400 mx-auto block mb-4">
          chat_bubble_outline
        </span>
        <p className="text-slate-500 dark:text-slate-400">Messages feature coming soon...</p>
      </div>
    </div>
  )
}
