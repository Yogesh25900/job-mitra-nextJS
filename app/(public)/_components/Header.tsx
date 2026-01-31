"use client"

import React, { useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"
import ThemeToggle from "./ThemeToggle"
import { useAuth } from "@/context/AuthContext"
import UserProfile from "./UserProfile"

const Navbar = () => {
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuth()

  const candidateLinks = [
    { name: "Home", path: "/" },
    { name: "Find Jobs", path: "/findjobs" },
    { name: "Freelance", path: "/freelance" },
    ...(isAuthenticated ? [{ name: "Notification", path: "/notifications" }] : []),
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ]

  const employerLinks = [
    { name: "Home", path: "/" },
    { name: "My Jobs", path: "/my-jobs" },
    { name: "Post a Job", path: "/postjob" },
    { name: "Company Profile", path: "/company-profile" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ]

  const links = useMemo(() => {
    const role = user?.role?.toLowerCase()
    return role === "employer" || role === "recruiter" ? employerLinks : candidateLinks
  }, [user?.role])

  // 🔔 UI-only notification badge (mocked)
  const [unreadCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="relative py-4 bg-white dark:bg-slate-950 w-full shadow-sm">
      <div className="mx-auto px-6 sm:px-8 max-w-7xl w-full">
        <nav className="flex items-center justify-between w-full">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-slate-900 dark:text-white"
          >
            JobMitra
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <div key={link.name} className="relative">
                <Link
                  href={link.path}
                  className={`text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white ${
                    pathname === link.path
                      ? "border-b-2 border-slate-900 dark:border-white"
                      : ""
                  }`}
                >
                  {link.name}
                </Link>

                {/* Notification Badge */}
                {link.name === "Notification" && unreadCount > 0 && (
                  <span className="absolute -top-2 -right-3 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />

            {/* Login / Signup */}
            {!isAuthenticated && (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Profile */}
            {isAuthenticated && user && (
              <div className="hidden md:block">
                <UserProfile user={user} />
              </div>
            )}

            {/* Mobile Menu */}
            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 px-6 pt-4 pb-6 space-y-4 shadow-lg">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setMenuOpen(false)}
              className={`block text-sm font-medium text-slate-700 dark:text-slate-300 ${
                pathname === link.path
                  ? "border-b-2 border-slate-900 dark:border-white"
                  : ""
              }`}
            >
              {link.name}
            </Link>
          ))}

          {!isAuthenticated ? (
            <>
              <Link href="/login" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Login</Link>
              <Link
                href="/register"
                className="block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                href={user?.role?.toLowerCase() === "employer" || user?.role?.toLowerCase() === "recruiter" ? "/donor/profile" : "/talent/profile"}
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Profile
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}

export { Navbar as Header }
export default Navbar
