"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { LogOut, User } from "lucide-react"
import GenerateAvatar from "@/components/GenerateAvatar"
import toast from "react-hot-toast"
import { useAuth } from "@/context/AuthContext"
import { getUserAvatarUrl } from "@/lib/utils/imageUrl"
import LogoutConfirmModal from "@/components/LogoutConfirmModal"

type UserProfileProps = {
  user: {
    fname?: string
    lname?: string
    email?: string
    profilePic?: string
    profilePicturePath?: string
    avatar?: string
    googleProfilePicture?: string
    role?: string
    companyName?: string
    contactName?: string
  }
}

export default function UserProfile({ user }: UserProfileProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const { logout } = useAuth()

  const displayName = user.fname 
    ? `${user.fname} ${user.lname || ''}`.trim()
    : user.companyName || user.contactName || 'User'

  const firstName = user.fname || user.contactName?.split(' ')[0] || ''
  const lastName = user.lname || user.contactName?.split(' ')[1] || ''
  const hasCustomAvatar = Boolean(
    user.profilePicturePath || user.profilePic || user.avatar || user.googleProfilePicture
  )
  const avatarUrl = hasCustomAvatar
    ? getUserAvatarUrl(
        user.profilePicturePath || user.profilePic,
        user.avatar || user.googleProfilePicture,
        user.email || ""
      )
    : undefined

  const handleLogoutClick = () => {
    setIsOpen(false);
    setShowLogoutModal(true);
  };

  const onLogout = async () => {
    setIsLoggingOut(true)
    try {
      toast.success("Logged out...")
      await logout()
      setShowLogoutModal(false)
    } catch (error: any) {
      console.error('Logout error:', error)
      toast.error("Logout failed")
    } finally {
      setIsLoggingOut(false)
    }
  }

  const profilePath = user.role?.toLowerCase() === "recruiter" || user.role?.toLowerCase() === "employer"
    ? "/employer/profile"
    : "/talent/profile"

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        aria-label="User menu"
      >
        <GenerateAvatar
          profilePic={avatarUrl}
          firstName={firstName}
          lastName={lastName}
          className="w-9 h-9"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {displayName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {user.email}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={() => {
                  setIsOpen(false)
                  router.push(profilePath)
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
              
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={onLogout}
        isLoading={isLoggingOut}
      />
    </div>
  )
}
