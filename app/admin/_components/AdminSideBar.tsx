"use client";

import { BarChart3, Users, Briefcase, Settings, LogOut, User, MessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";
import ThemeToggle from "@/app/(public)/_components/ThemeToggle";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  action?: () => void;
}

export default function AdminSideBar() {
  const { logout, user } = useAuth();
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  // Define menu items
  const navItems: NavItem[] = [
    { label: "Dashboard", icon: <BarChart3 className="w-5 h-5" />, href: "/admin" },
    { label: "User Management", icon: <Users className="w-5 h-5" />, href: "/admin/users" },
    { label: "Job Management", icon: <Briefcase className="w-5 h-5" />, href: "/admin/jobs" },
    { label: "Feedback", icon: <MessageSquare className="w-5 h-5" />, href: "/admin/feedback" },
    { label: "Profile", icon: <User className="w-5 h-5" />, href: "/admin/profile" },
    { label: "Settings", icon: <Settings className="w-5 h-5" />, href: "/admin/settings" },
    { label: "Logout", icon: <LogOut className="w-5 h-5" />, action: handleLogoutClick },
  ];

  const isItemActive = (href?: string) => {
    if (!href) return false;
    if (href === "/admin") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="w-64 flex-shrink-0 border-r border-[#e7edf3] dark:border-slate-800 bg-white dark:bg-slate-950 hidden lg:flex flex-col">
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3 border-b border-[#e7edf3] dark:border-slate-800">
      <div className="flex flex-col gap-6 flex-1">
         <Link href="/" className="flex items-center justify-start hover:opacity-80 transition-opacity">
          <Image
            src="/logo/jobmitra_logo.png"
            alt="JobMitra Logo"
            width={120}
            height={20}
            priority
            className="h-auto w-auto"
          />
        </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems
          .filter(item => item.label !== "Logout") // Logout will go in footer
          .map((item, index) => {
            const isActive = isItemActive(item.href);
            
            const content = (
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 dark:text-slate-400 hover:bg-[#e7edf3] dark:hover:bg-slate-800'
              }`}>
                {item.icon}
                {item.label}
              </div>
            );

            if (item.action) {
              return (
                <button
                  key={index}
                  onClick={item.action}
                  className="w-full text-left"
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={index}
                href={item.href || "#"}
                className="block"
              >
                {content}
              </Link>
            );
          })}
      </nav>

      {/* Footer - Logout & User Profile */}
      <div className="p-4 border-t border-[#e7edf3] dark:border-slate-800 space-y-2">
        {/* Logout Button */}
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium text-gray-600 dark:text-slate-400 hover:bg-[#e7edf3] dark:hover:bg-slate-800"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>

        {/* User Profile Link */}
        <Link href="/admin/profile" className="block">
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            isItemActive("/admin/profile")
              ? "bg-primary/10 text-primary"
              : "bg-[#e7edf3] dark:bg-slate-800 text-gray-900 dark:text-slate-200 hover:bg-[#cad9e8] dark:hover:bg-slate-700"
          }`}>
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.fname?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{user?.fname || "Admin"}</p>
            <p className="text-xs text-gray-600 dark:text-slate-500">Administrator</p>
          </div>
          </div>
        </Link>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        isLoading={isLoggingOut}
      />
    </aside>
  );
}
