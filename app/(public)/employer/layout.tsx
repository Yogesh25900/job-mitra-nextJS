import type { ReactNode } from 'react'
import Sidebar from '../_components/SideBar'
import GlobalSidebar from '../_components/GlobalSidebar'

export default function EmployerLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen">
         <GlobalSidebar />
         <main className="flex-1 w-full lg:ml-0 bg-white dark:bg-slate-900">
           <div className="p-4 pt-16 lg:pt-6 md:p-6 lg:p-8">
             <div className="max-w-[1400px] mx-auto w-full">
               {children}
             </div>
           </div>
         </main>
       </div>
       
  )
}
