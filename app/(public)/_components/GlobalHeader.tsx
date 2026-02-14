"use client"

import Link from "next/link"
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
    { name: "Find Jobs", path: "/newjob", icon: <Search size={16} /> },
    { name: "Freelance", path: "/freelance", icon: <Briefcase size={16} /> },
    ...(isAuthenticated ? [{ name: "Notification", path: "/notifications", icon: <Bell size={16} /> }] : []),
    { name: "About", path: "/about", icon: <FileText size={16} /> },
    { name: "Contact", path: "/contact", icon: <User size={16} /> },
  ]

  const employerLinks = [
    { name: "Home", path: "/", icon: <Home size={16} /> },
    { name: "My Jobs", path: "/my-jobs", icon: <Briefcase size={16} /> },
    { name: "Post a Job", path: "/postjob", icon: <FileText size={16} /> },
    { name: "Company Profile", path: "/company-profile", icon: <User size={16} /> },
    { name: "About", path: "/about", icon: <FileText size={16} /> },
    { name: "Contact", path: "/contact", icon: <User size={16} /> },
  ]

  const links = useMemo(() => {
    const role = user?.role?.toLowerCase()
    return role === "employer" || role === "recruiter" ? employerLinks : candidateLinks
  }, [user?.role, isAuthenticated])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-surface-dark shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-slate-900 dark:text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
            <span className="material-symbols-outlined text-[20px]">work</span>
          </div>
          <span className="text-xl font-bold tracking-tight">JobFinder</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
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
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {!isAuthenticated ? (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Login
              </Link>
              <Link href="/register" className="text-sm font-medium btn-primary">
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="hidden md:block">
              <UserProfile user={user} />
            </div>
          )}

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface-light dark:bg-surface-dark px-4 py-4 space-y-2 border-t border-slate-200 dark:border-slate-800">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
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
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block bg-primary text-white px-4 py-2 rounded-lg text-center"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <Link
              href="/profile"
              className="block flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"
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
  