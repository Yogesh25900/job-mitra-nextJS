"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Code,
  Palette,
  Megaphone,
  FileText,
  Headphones,
} from "lucide-react";

export default function JobMitraLanding() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { icon: Code, title: "Tech & Development", jobs: 120 },
    { icon: Palette, title: "Design & Creative", jobs: 85 },
    { icon: Megaphone, title: "Sales & Marketing", jobs: 210 },
    { icon: FileText, title: "Writing & Translation", jobs: 45 },
    { icon: Headphones, title: "Admin & Customer", jobs: 98 },
  ];

  const handleSearch = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/find-jobs?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-gray-200 font-sans transition-colors duration-300">
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
              Find Your Dream Job or Hire Top
              <br className="hidden sm:block" />
              Freelancers Instantly
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
              AI-driven platform connecting talent and opportunity across Nepal.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/find-jobs" className="w-full sm:w-auto bg-purple-600 text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity text-center">
                Find Jobs
              </Link>
              <Link href="/freelance" className="w-full sm:w-auto bg-transparent text-slate-900 dark:text-white font-semibold px-8 py-3 rounded-lg border-2 border-gray-300/30 dark:border-gray-500/50 hover:border-slate-900 dark:hover:border-white transition-colors text-center">
                Freelance
              </Link>
            </div>
            <p className="mt-6 text-sm text-slate-600 dark:text-gray-500">
              Trusted by 100+ Companies and Leading Startups
            </p>
          </div>
        </section>

        {/* Search Bar */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-4 rounded-xl shadow-lg max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                className="w-full bg-white/5 dark:bg-gray-700/50 border-0 text-slate-900 dark:text-white placeholder-slate-400 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-600 transition outline-none"
                placeholder="Search Job titles or skills"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
              />
              <button
                className="w-full sm:w-auto bg-purple-600 text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Popular Job Categories */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white">
              Popular Job Categories
            </h2>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <div
                    key={index}
                      className="bg-white/5 dark:bg-gray-800/60 p-6 rounded-xl border border-gray-200/10 dark:border-gray-700/50 text-center hover:border-purple-600 transition-colors cursor-pointer"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600/10 rounded-lg">
                      <IconComponent className="text-purple-600" size={28} />
                    </div>
                      <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                      {category.title}
                    </h3>
                      <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
                      {category.jobs} Jobs
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white">
              How JobMitra Works
            </h2>
            <div className="mt-12 grid md:grid-cols-3 gap-8 md:gap-12 text-center">
              <div>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 dark:bg-gray-800 rounded-full">
                  <FileText className="text-purple-600" size={48} />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">
                  1. Upload Your CV
                </h3>
                <p className="mt-2 text-slate-600 dark:text-gray-400">
                  Securely upload your professional documents or fill out your detailed profile.
                </p>
              </div>
              <div>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 dark:bg-gray-800 rounded-full">
                  <Code className="text-purple-600" size={48} />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">
                  2. AI Analyzes Profile
                </h3>
                <p className="mt-2 text-slate-600 dark:text-gray-400">
                  Our proprietary AI engine assesses your skills, experience, and career goals.
                </p>
              </div>
              <div>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 dark:bg-gray-800 rounded-full">
                  <Megaphone className="text-purple-600" size={48} />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">
                  3. Get Perfect Matches
                </h3>
                <p className="mt-2 text-slate-600 dark:text-gray-400">
                  Receive only the most relevant job and candidate matches, saving you time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#1D1836] text-slate-700 dark:text-gray-400 py-12">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">JobMitra</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">
                Bridging Skills with AI Precision
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">Quick Links</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="/find-jobs" className="hover:text-slate-900 dark:hover:text-white transition">Browse Jobs</Link></li>
                <li><Link href="/freelance" className="hover:text-slate-900 dark:hover:text-white transition">Find Freelancers</Link></li>
                <li><Link href="/about" className="hover:text-slate-900 dark:hover:text-white transition">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-slate-900 dark:hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">For Employers</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Post a Job</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Find Talent</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">Connect</h4>
              <div className="flex items-center space-x-4 mt-4">
                <a href="#" className="hover:text-slate-900 dark:hover:text-white transition">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="hover:text-slate-900 dark:hover:text-white transition">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="hover:text-slate-900 dark:hover:text-white transition">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
   

          <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-500">
            <p>Copyright © 2025 JobMitra. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
