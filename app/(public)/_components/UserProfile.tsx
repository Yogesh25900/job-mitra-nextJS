"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { LogOut, User } from "lucide-react"
import GenerateAvatar from "@/components/GenerateAvatar"
import { handleLogout } from "@/lib/actions/auth-action"
import toast from "react-hot-toast"

type UserProfileProps = {
  user: {
    fname?: string
    lname?: string
    email?: string
    profilePic?: string
    role?: string
    companyName?: string
    contactName?: string
  }
}

export default function UserProfile({ user }: UserProfileProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const displayName = user.fname 
    ? `${user.fname} ${user.lname || ''}`.trim()
    : user.companyName || user.contactName || 'User'

  const firstName = user.fname || user.contactName?.split(' ')[0] || ''
  const lastName = user.lname || user.contactName?.split(' ')[1] || ''

  const onLogout = async () => {
    setIsLoggingOut(true)
    try {
      toast.success("Logged out...")
      await handleLogout()
      // handleLogout uses redirect() which will throw NEXT_REDIRECT
      // This line won't be reached, but that's expected
    } catch (error: any) {
      // Check if it's the expected redirect error
      if (error?.message?.includes('NEXT_REDIRECT') || error?.digest?.includes('NEXT_REDIRECT')) {
        // This is expected - the redirect is working, we can ignore this error
        console.log('Redirect in progress...')
        return
      }
      // Only show error for actual failures
      console.error('Logout error:', error)
      toast.error("Logout failed")
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        aria-label="User menu"
      >
        <GenerateAvatar
          profilePic={user.profilePic}
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
                  router.push('/profile')
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
              
              <button
                onClick={onLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
