"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const hiringManagers = [
  { name: 'Sarah Jenkins', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQY8UX4B1hYsQ8glI1h5mZX3UCMOBDHT_NATBzPLpl3TZ3h678PPEETsgE-doeLN5om2YxMApkJWS95fzG_EtnuoXhRpQPdFlL6TbTA4a_VD3UEzRCUNUKt7wuWFrN4c9r73uxl4A4IsowAwZjFLaYy0jY9ABoa-dmA0oCqCh1NjQCin2_uA-y72dws_ZxTtPzWRYq3qKlcyWP_91QpbuvwWPFNJzNIsBTNDwVXFoQhga_S_oCVkId6xUHgLMukcnzkvage69ONv8a' },
  { name: 'David Chen', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhV-cedSMtiWXg8QrVbe53fszhipOK_ErXRo1a0EATrFCwniORcGzk4Sd6R-8uiKIcaTDfgyH4bCjIWpWfvCNBQkjm0R6BFeJCTpArPERwru0oG-mBR0lYszOa0LUVVkmEXAdBw8rflHMOiKImx8BTg9GLQ3BjUdrXr3S_M7RhRu4SGBo7CUhg7K3YyEGRHq7wNZ_rg9eIFPiurG4i-TuE8ozQOzu2vmJOdUvVmVdzSyokdmyWddQdL53V-uL-h-xEjVCUdrkP4Nb9' },
]

const getNavLinkClass = (isActive: boolean) =>
  isActive
    ? 'flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-bold'
    : 'flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#e7edf3] dark:hover:bg-slate-800 transition-colors'

export default function Sidebar() {
  const pathname = usePathname()
  const isDashboard = pathname === '/employer'
  const isAddJob = pathname.startsWith('/employer/add-job')

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-[#e7edf3] dark:border-slate-800 h-[calc(100vh-64px)] sticky top-16 p-6">
      <div className="flex flex-col gap-6">
        {/* Dashboard Section */}
        <div>
          <h1 className="text-xs font-bold uppercase tracking-widest text-[#4c739a] mb-4">
            Dashboard
          </h1>
          <nav className="flex flex-col gap-1">
            <Link
              href="/employer"
              className={getNavLinkClass(isDashboard)}
            >
              <span className="material-symbols-outlined">work</span>
              <span className="text-sm">All Job Postings</span>
            </Link>
            <Link
              href="/employer/add-job"
              className={getNavLinkClass(isAddJob)}
            >
              <span
                className={`material-symbols-outlined ${
                  isAddJob ? '' : 'text-[#4c739a]'
                }`}
              >
                add_circle
              </span>
              <span className="text-sm">Add Job</span>
            </Link>
            <Link
              href="#"
              className={getNavLinkClass(false)}
            >
              <span className="material-symbols-outlined text-[#4c739a]">
                group
              </span>
              <span className="text-sm">Candidates</span>
            </Link>
            <Link
              href="#"
              className={getNavLinkClass(false)}
            >
              <span className="material-symbols-outlined text-[#4c739a]">
                calendar_today
              </span>
              <span className="text-sm">Interviews</span>
            </Link>
          </nav>
        </div>

        {/* Departments Section */}
        <div>
          <h1 className="text-xs font-bold uppercase tracking-widest text-[#4c739a] mb-4">
            Departments
          </h1>
          <nav className="flex flex-col gap-1">
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#e7edf3] dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-[#4c739a] text-[20px]">
                terminal
              </span>
              <span className="text-sm">Engineering</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#e7edf3] dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-[#4c739a] text-[20px]">
                campaign
              </span>
              <span className="text-sm">Marketing</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#e7edf3] dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-[#4c739a] text-[20px]">
                analytics
              </span>
              <span className="text-sm">Sales</span>
            </Link>
          </nav>
        </div>

        {/* Hiring Managers Section */}
        <div>
          <h1 className="text-xs font-bold uppercase tracking-widest text-[#4c739a] mb-4">
            Hiring Managers
          </h1>
          <div className="flex flex-col gap-3 px-3">
            {hiringManagers.map((manager) => (
              <div key={manager.name} className="flex items-center gap-2">
                <div
                  className="size-6 rounded-full bg-slate-300 bg-cover"
                  style={{
                    backgroundImage: `url("${manager.avatar}")`,
                  }}
                 
                />
                <span className="text-xs font-medium">{manager.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}