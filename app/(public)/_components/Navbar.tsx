"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { Bot } from "lucide-react";
import UserProfile from "./UserProfile";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#e5e8eb] dark:border-[#283639] bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <Bot size={20} />
                </div>
            <span className="text-xl font-bold tracking-tight">JobMitra</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/findjobs" className="text-sm font-medium text-[#4f6266] hover:text-[#111718] dark:text-[#9db4b9] dark:hover:text-white transition-colors">
              Find Work
            </Link>
            <Link href="#" className="text-sm font-medium text-[#4f6266] hover:text-[#111718] dark:text-[#9db4b9] dark:hover:text-white transition-colors">
              Hire Talent
            </Link>
            <Link href="#" className="text-sm font-medium text-[#4f6266] hover:text-[#111718] dark:text-[#9db4b9] dark:hover:text-white transition-colors">
              Success Stories
            </Link>
            <Link href="#" className="text-sm font-medium text-[#4f6266] hover:text-[#111718] dark:text-[#9db4b9] dark:hover:text-white transition-colors">
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            {isAuthenticated && user ? (
              <UserProfile user={user} />
            ) : (
              <>
                <Link href="/login" 
                  className="hidden sm:flex h-9 items-center justify-center rounded px-4 text-sm font-bold text-[#111718] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  Log In
                </Link>
                <Link
                  href="/register" 
                  className="block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
