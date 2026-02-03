"use client";

import { BarChart3, Users, Briefcase, DollarSign, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  action?: () => void;
}

export default function AdminSideBar() {
  const { logout } = useAuth();
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
    { label: "Job Management", icon: <Briefcase className="w-5 h-5" /> },
    { label: "Analytics", icon: <BarChart3 className="w-5 h-5" /> },
    { label: "Payments", icon: <DollarSign className="w-5 h-5" /> },
    { label: "Settings", icon: <Settings className="w-5 h-5" /> },
    { label: "Logout", icon: <LogOut className="w-5 h-5" />, action: handleLogoutClick },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 rounded-lg p-1 flex items-center justify-center">
          <Briefcase className="text-white w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">JobMitra</h1>
          <p className="text-xs text-gray-500 dark:text-blue-300">Admin Central</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems
          .filter(item => item.label !== "Logout") // Logout will go in footer
          .map((item, index) => {
            const isActive = item.href && pathname === item.href;
            return (
              <Link
                key={index}
                href={item.href || "#"}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  isActive
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-800 space-y-1">
        {navItems
          .filter(item => item.label === "Settings")
          .map((item, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
            >
              {item.icon}
              {item.label}
            </a>
          ))}
        {navItems
          .filter(item => item.label === "Logout")
          .map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
            >
              {item.icon}
              {item.label}
            </button>
          ))}
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
