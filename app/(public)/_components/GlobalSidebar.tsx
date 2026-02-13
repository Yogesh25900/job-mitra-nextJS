"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'
import toast from 'react-hot-toast'

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
  { name: 'Notifications', path: '/talent/notifications', icon: 'notifications', badge: '2' },
  { name: 'Profile', path: '/talent/profile', icon: 'person' },
]

const EMPLOYER_LINKS: NavLink[] = [
  { name: 'All Job Postings', path: '/employer', icon: 'work' },
  { name: 'Add Job', path: '/employer/add-job', icon: 'add_circle' },
  { name: 'Candidates', path: '/employer/candidates', icon: 'group' },
  { name: 'Interviews', path: '/employer/interviews', icon: 'calendar_today' },
  { name: 'Notifications', path: '/employer/notifications', icon: 'notifications', badge: '2' },
  { name: 'Profile', path: '/employer/profile', icon: 'person' },

]

export default function GlobalSidebar() {
  const { user, isAuthenticated, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  if (!isAuthenticated || !user) {
    return null
  }

  const userRole = user?.role?.toLowerCase()
  const isTalent = userRole === 'candidate'
  const isEmployer = userRole === 'employer' || userRole === 'recruiter'
  const navLinks = isTalent ? TALENT_LINKS : isEmployer ? EMPLOYER_LINKS : []

  const handleLogout = async () => {
    setIsLoggingOut(true)
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
    <aside className="hidden lg:flex w-64 flex-col border-r border-[#e7edf3] dark:border-slate-800 h-[calc(100vh-64px)] sticky top-16 p-6 overflow-y-auto">
      <div className="flex flex-col gap-6 flex-1">
        {/* Dashboard Section */}
        <div>
          <h1 className="text-xs font-bold uppercase tracking-widest text-[#4c739a] mb-4">
            {isEmployer ? 'Dashboard' : 'Navigation'}
          </h1>
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.path || pathname.startsWith(link.path + '/')
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={getNavLinkClass(isActive)}
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
      <div className="border-t border-[#e7edf3] dark:border-slate-800 pt-4 space-y-4">
        {/* User Profile Card */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f6f7f8] dark:bg-slate-800">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm flex-shrink-0 overflow-hidden">
            {user?.profilePicturePath ? (
              <img
                src={user.profilePicturePath}
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
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[#e7edf3] dark:border-slate-700 text-[#4c739a] hover:bg-[#e7edf3] dark:hover:bg-slate-800 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </aside>
  )
}
