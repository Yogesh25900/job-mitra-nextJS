"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useMemo } from "react"
import { Menu, X, Home, Search, Briefcase, Bell, User, FileText } from "lucide-react"
import ThemeToggle from "./ThemeToggle"
import { useAuth } from "@/context/AuthContext"
import UserProfile from "./UserProfile"
import { usePathname } from "next/navigation"

export default function GlobalHeader() {
  const { user, isAuthenticated } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [unreadCount] = useState(3) // example count
  const pathname = usePathname()

  // Role-based links with icons
  const candidateLinks = [
    { name: "Home", path: "/", icon: <Home size={16} /> },
    { name: "Find Jobs", path: "/jobs", icon: <Search size={16} /> },
    { name: "About", path: "/about", icon: <FileText size={16} /> },
    { name: "Contact", path: "/contact", icon: <User size={16} /> },
  ]

  const employerLinks = [
    { name: "Home", path: "/", icon: <Home size={16} /> },
    { name: "My Jobs", path: "/employer", icon: <Briefcase size={16} /> },
    { name: "Post a Job", path: "/employer/add-job", icon: <FileText size={16} /> },
    { name: "Company Profile", path: "/employer/profile", icon: <User size={16} /> },
    { name: "About", path: "/about", icon: <FileText size={16} /> },
    { name: "Contact", path: "/contact", icon: <User size={16} /> },
  ]

  const adminLinks = [
    { name: "Dashboard", path: "/admin", icon: <Briefcase size={16} /> },
    { name: "Users", path: "/admin/users", icon: <User size={16} /> },
    { name: "Jobs", path: "/admin/jobs", icon: <Search size={16} /> },
  ]

  const links = useMemo(() => {
    const role = user?.role?.toLowerCase()
    if (role === "admin") return adminLinks
    return role === "employer" || role === "recruiter" ? employerLinks : candidateLinks
  }, [user?.role, isAuthenticated])

  const logoHref = useMemo(() => {
    const role = user?.role?.toLowerCase()
    return role === "admin" ? "/admin" : "/"
  }, [user?.role])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/20 dark:border-slate-800/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg backdrop-saturate-150 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-2 sm:px-4 lg:px-8">
        {/* Logo */}
        <Link href={logoHref} className="flex items-center gap-2 text-slate-900 dark:text-white hover:opacity-80 transition-opacity min-w-[100px]">
          <Image
            src="/logo/jobmitra_logo.png"
            alt="JobMitra Logo"
            width={120}
            height={20}
            priority
            className="h-auto w-auto max-w-[120px]"
          />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                pathname === link.path
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 hover:bg-primary/10 hover:text-primary dark:text-slate-300 dark:hover:bg-primary/10 dark:hover:text-primary"
              }`}
            >
              {link.icon}
              {link.name}
              {link.name === "Notification" && unreadCount > 0 && (
                <span className="ml-1 inline-block h-2 w-2 rounded-full bg-red-500" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />

          {!isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2 sm:gap-4">
              <Link href="/login" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Login
              </Link>
              <Link href="/register" className="text-sm font-medium bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg">
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="hidden md:block">
              <UserProfile user={user} />
            </div>
          )}

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 focus:outline-none focus:ring-2 focus:ring-primary rounded" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg px-2 py-4 space-y-2 border-t border-slate-200/20 dark:border-slate-800/30 shadow-lg">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-3 rounded-md text-base font-medium transition-colors ${
                pathname === link.path
                  ? "bg-primary/10 text-primary"
                  : "text-slate-700 hover:bg-primary/10 hover:text-primary dark:text-slate-300 dark:hover:bg-primary/10 dark:hover:text-primary"
              }`}
            >
              {link.icon}
              {link.name}
              {link.name === "Notification" && unreadCount > 0 && (
                <span className="ml-1 inline-block h-2 w-2 rounded-full bg-red-500" />
              )}
            </Link>
          ))}

          {!isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="block text-base font-medium text-slate-700 dark:text-slate-300 px-3 py-3"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block bg-primary hover:bg-primary/90 text-white px-4 py-3 rounded-lg text-center mx-3"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <Link
              href={
                user?.role?.toLowerCase() === 'employer' || user?.role?.toLowerCase() === 'recruiter'
                  ? '/employer/profile'
                  : user?.role?.toLowerCase() === 'candidate' || user?.role?.toLowerCase() === 'talent'
                  ? '/talent/profile'
                  : '/profile'
              }
              className="block flex items-center gap-2 text-base font-medium text-slate-700 dark:text-slate-300 px-3 py-3"
            >
              <User size={16} />
              Profile
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
  