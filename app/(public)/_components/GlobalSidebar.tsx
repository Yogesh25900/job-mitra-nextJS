"use client"

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Moon, Sun, Monitor } from 'lucide-react'
import { buildImageUrl } from '@/lib/utils/imageUrl'

type Theme = "light" | "dark" | "system";

const hiringManagers = [
  { name: 'Sarah Jenkins', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQY8UX4B1hYsQ8glI1h5mZX3UCMOBDHT_NATBzPLpl3TZ3h678PPEETsgE-doeLN5om2YxMApkJWS95fzG_EtnuoXhRpQPdFlL6TbTA4a_VD3UEzRCUNUKt7wuWFrN4c9r73uxl4A4IsowAwZjFLaYy0jY9ABoa-dmA0oCqCh1NjQCin2_uA-y72dws_ZxTtPzWRYq3qKlcyWP_91QpbuvwWPFNJzNIsBTNDwVXFoQhga_S_oCVkId6xUHgLMukcnzkvage69ONv8a' },
  { name: 'David Chen', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhV-cedSMtiWXg8QrVbe53fszhipOK_ErXRo1a0EATrFCwniORcGzk4Sd6R-8uiKIcaTDfgyH4bCjIWpWfvCNBQkjm0R6BFeJCTpArPERwru0oG-mBR0lYszOa0LUVVkmEXAdBw8rflHMOiKImx8BTg9GLQ3BjUdrXr3S_M7RhRu4SGBo7CUhg7K3YyEGRHq7wNZ_rg9eIFPiurG4i-TuE8ozQOzu2vmJOdUvVmVdzSyokdmyWddQdL53V-uL-h-xEjVCUdrkP4Nb9' },
]

const getNavLinkClass = (isActive: boolean) =>
  isActive
    ? 'flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-bold'
    : 'flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#e7edf3] dark:hover:bg-slate-800 transition-colors'

interface NavLink {
  name: string
  path: string
  icon: string
  badge?: string
}

const TALENT_LINKS: NavLink[] = [
  { name: 'Dashboard', path: '/talent', icon: 'dashboard' },
  { name: 'Applications', path: '/talent/applications', icon: 'work' },
  { name: 'Saved Jobs', path: '/talent/saved', icon: 'bookmark' },
  { name: 'Recommendations', path: '/talent/recommendations', icon: 'auto_awesome' },
  { name: 'Notifications', path: '/talent/notifications', icon: 'notifications', badge: '2' },
  { name: 'Profile', path: '/talent/profile', icon: 'person' },
  { name: 'Settings', path: '/talent/settings', icon: 'settings' },
]

const EMPLOYER_LINKS: NavLink[] = [
  { name: 'All Job Postings', path: '/employer', icon: 'work' },
  { name: 'Add Job', path: '/employer/add-job', icon: 'add_circle' },
  
  { name: 'Notifications', path: '/employer/notifications', icon: 'notifications', badge: '2' },
  { name: 'Profile', path: '/employer/profile', icon: 'person' },
  { name: 'Settings', path: '/employer/settings', icon: 'settings' },

]

export default function GlobalSidebar() {
  const { user, isAuthenticated, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [theme, setTheme] = useState<Theme>("system")
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("theme") as Theme | null
    const initial: Theme = stored ?? "system"
    setTheme(initial)
  }, [])

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Apply theme changes
  useEffect(() => {
    if (!mounted) return
    
    const root = document.documentElement
    const apply = (t: Theme) => {
      if (t === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        if (prefersDark) {
          root.classList.add("dark")
        } else {
          root.classList.remove("dark")
        }
      } else if (t === "dark") {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }

    apply(theme)
    localStorage.setItem("theme", theme)
  }, [theme, mounted])

  const cycleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : prev === "dark" ? "system" : "light"))
  }

  if (!isAuthenticated || !user) {
    return <></>
  }

  const userRole = user?.role?.toLowerCase()
  const isTalent = userRole === 'candidate'
  const isEmployer = userRole === 'employer' || userRole === 'recruiter'
  const navLinks = isTalent ? TALENT_LINKS : isEmployer ? EMPLOYER_LINKS : []
  const profileImageSrc =
    buildImageUrl(
      user?.profilePicturePath || user?.logoPath || user?.googleProfilePicture,
      isEmployer ? 'logo' : 'profile'
    ) || ''

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setIsMobileMenuOpen(false)
    setShowLogoutModal(false)
    try {
      await logout()
      toast.success('Logged out successfully')
      router.push('/login')
    } catch (error: any) {
      toast.error(error?.message || 'Logout failed')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const showLogoutConfirmation = () => {
    setShowLogoutModal(true)
  }

  const handleCancelLogout = () => {
    setShowLogoutModal(false)
  }

  const getInitials = () => {
    if (isTalent) {
      const fname = user?.fname || ''
      const lname = user?.lname || ''
      return `${fname.charAt(0)}${lname.charAt(0)}`.toUpperCase()
    } else {
      const companyName = user?.companyName || 'Company'
      return companyName.charAt(0).toUpperCase()
    }
  }

  const getUserDisplayName = () => {
    if (isTalent) {
      return `${user?.fname || ''} ${user?.lname || ''}`.trim()
    } else {
      return user?.companyName || 'Company'
    }
  }

  return (
    <>
      {/* Mobile Menu Button */}
      {isAuthenticated && user && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-[#e7edf3] dark:border-slate-700"
          aria-label="Toggle mobile menu"
        >
          <span className="material-symbols-outlined text-[#4c739a] dark:text-slate-300">
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 lg:z-auto
        w-64 h-screen flex flex-col
        border-r border-[#e7edf3] dark:border-slate-800
        bg-white dark:bg-slate-900
        p-4 md:p-6 overflow-y-auto
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Close button for mobile, inside sidebar */}
        {isMobileMenuOpen && (
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden absolute top-4 left-4 z-50 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary shadow-md"
            aria-label="Close sidebar"
          >
            <span className="material-symbols-outlined text-white text-lg">close</span>
          </button>
        )}
        <div className="flex flex-col gap-6 flex-1 mt-10 md:mt-0">
        {/* Logo Section */}
        <Link 
          href="/" 
          className="flex items-center justify-start hover:opacity-80 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <Image
            src="/logo/jobmitra_logo.png"
            alt="JobMitra Logo"
            width={120}
            height={20}
            priority
            className="h-auto w-auto"
          />
        </Link>

        {/* Dashboard Section */}
        <div>
         
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.path
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={getNavLinkClass(isActive)}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className={`material-symbols-outlined ${
                    isActive ? '' : 'text-[#4c739a]'
                  }`}>
                    {link.icon}
                  </span>
                  <span className="text-sm">{link.name}</span>
                  {link.badge && (
                    <span className="ml-auto bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>


    
      </div>

      {/* Profile Section - Bottom */}
      <div className="border-t border-[#e7edf3] dark:border-slate-800 pt-4 pb-8 mb-6 space-y-4">
        {/* Theme Toggle */}
        {mounted && (
          <button
            type="button"
            onClick={cycleTheme}
            title={`Theme: ${theme === "system" ? "System" : theme === "dark" ? "Dark" : "Light"}`}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[#e7edf3] dark:border-slate-700 text-[#4c739a] dark:text-slate-300 hover:bg-[#e7edf3] dark:hover:bg-slate-800 transition-colors font-medium text-sm"
          >
            {theme === "light" ? (
              <>
                <Sun size={18} />
                <span>Light Mode</span>
              </>
            ) : theme === "dark" ? (
              <>
                <Moon size={18} />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <Monitor size={18} />
                <span>System</span>
              </>
            )}
          </button>
        )}

        {/* User Profile Card */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f6f7f8] dark:bg-slate-800">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm flex-shrink-0 overflow-hidden">
            {profileImageSrc ? (
              <img
                src={profileImageSrc}
                alt={getUserDisplayName()}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              getInitials()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#111418] dark:text-white truncate">
              {getUserDisplayName()}
            </p>
            <p className="text-xs text-[#4c739a] truncate">
              {user?.email || (isTalent ? 'Talent' : 'Employer')}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={showLogoutConfirmation}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[#e7edf3] dark:border-slate-700 text-[#4c739a] hover:bg-[#e7edf3] dark:hover:bg-slate-800 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </aside>

    {/* Logout Confirmation Modal */}
    {showLogoutModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <span className="material-symbols-outlined text-red-600 dark:text-red-400">logout</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Confirm Logout</h3>
          </div>
          
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Are you sure you want to log out? You'll need to sign in again to access your account.
          </p>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleCancelLogout}
              disabled={isLoggingOut}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoggingOut && (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              )}
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
