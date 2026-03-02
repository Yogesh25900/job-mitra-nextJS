"use client";

import React, { useState } from "react";
import { HelpCircle, X } from "lucide-react";
import FeedbackModal from "./FeedbackModal";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function FloatingFeedbackButton() {
  const { isAuthenticated } = useAuth();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");

  // Only show for authenticated users and hide from admin routes
  if (!isAuthenticated || isAdminRoute) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsFeedbackModalOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-6 left-6 z-40 group"
        aria-label="Report Feedback"
      >
        <div className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="flex items-center justify-center w-14 h-12 flex-shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <span
            className={`text-sm font-medium whitespace-nowrap pr-4 transition-all duration-300 ${
              isHovered ? "max-w-[120px] opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            Report Feedback
          </span>
        </div>

        {/* Tooltip */}
        <div
          className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-slate-900 dark:bg-slate-800 text-white text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          Report a problem or send feedback
          <div className="absolute top-full left-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900 dark:border-t-slate-800"></div>
        </div>
      </button>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </>
  );
}
