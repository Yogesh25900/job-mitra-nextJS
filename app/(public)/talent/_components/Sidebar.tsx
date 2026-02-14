'use client'

type ViewType = 'dashboard' | 'applications' | 'saved' | 'notifications' | 'messages' | 'profile'

interface NavLink {
  icon: string
  label: string
  view: ViewType
  badge?: string
}

interface SidebarProps {
  activeView: ViewType
  onViewChange: (view: ViewType) => void
}

const navLinks: NavLink[] = [
  { icon: 'dashboard', label: 'Dashboard', view: 'dashboard' },
  { icon: 'work', label: 'Applications', view: 'applications' },
  { icon: 'bookmark', label: 'Saved Jobs', view: 'saved' },
  { icon: 'notifications', label: 'Notifications', view: 'notifications', badge: '2' },
  { icon: 'chat_bubble', label: 'Messages', view: 'messages', badge: '3' },
  { icon: 'person', label: 'Profile', view: 'profile' },
]

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-[#1a2632] border-r border-slate-200 dark:border-slate-800 h-full flex-shrink-0">
      <div className="flex flex-col h-full p-4">
       

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 flex-1">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => onViewChange(link.view)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left w-full ${
                activeView === link.view
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">
                {link.icon}
              </span>
              <p className="text-sm font-medium leading-normal">{link.label}</p>
              {link.badge && (
                <span className="ml-auto bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {link.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom Links */}
        <div className="mt-auto border-t border-slate-200 dark:border-slate-700 pt-4">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors w-full text-left">
            <span className="material-symbols-outlined text-[24px]">
              settings
            </span>
            <p className="text-sm font-medium leading-normal">Settings</p>
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors w-full text-left">
            <span className="material-symbols-outlined text-[24px]">
              logout
            </span>
            <p className="text-sm font-medium leading-normal">Log Out</p>
          </button>
        </div>
      </div>
    </aside>
  )
}