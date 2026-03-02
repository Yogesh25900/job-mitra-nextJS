"use client"

import React, { useState } from "react"
import { MessageCircle, X } from "lucide-react"
import AIChatModal from "./AIChatModal"
import { usePathname } from "next/navigation"

export default function FloatingAIButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const pathname = usePathname()

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/verify-otp" ||
    pathname === "/reset-password" ||
    pathname === "/talent/login" ||
    pathname === "/recruiter/login" ||
    pathname === "/talent/forgot-password" ||
    pathname === "/recruiter/forgot-password" ||
    pathname === "/admin/login"

  if (isAuthPage) {
    return null
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-6 right-6 z-40 group"
        aria-label="Open AI Assistant"
      >
        {/* Button Circle */}
        <div className="relative w-14 h-12 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center">
          {/* Pulse Animation Ring */}
          <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20"></div>
          
          {/* Icon */}
          <MessageCircle className="w-6 h-6 text-white relative z-10" />
          
          {/* Notification Badge (optional - can be conditional) */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          </span>
        </div>

        {/* Tooltip */}
        <div
          className={`absolute bottom-full right-0 mb-2 px-3 py-2 bg-slate-900 dark:bg-slate-800 text-white text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          Need help? Chat with AI
          <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900 dark:border-t-slate-800"></div>
        </div>
      </button>

      {/* AI Chat Modal */}
      <AIChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
