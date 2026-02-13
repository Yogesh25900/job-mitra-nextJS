'use client'

import ProfileView from "../../_components/profile/ProfileView"

export default function TalentProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Profile
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base mt-1">
            Manage your professional profile and settings
          </p>
        </div>
      </div>
      <ProfileView role="talent" editPath="/talent/profile/edit" />
    </div>
  )
}
