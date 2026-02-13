"use client"

import { ReactNode } from 'react'
import GlobalSidebar from '@/app/(public)/_components/GlobalSidebar'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-[calc(100vh-64px)]">
      <GlobalSidebar />
      <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
        {children}
      </main>
    </div>
  )
}
