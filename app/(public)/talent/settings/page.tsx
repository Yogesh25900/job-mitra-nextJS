'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Settings, Key, Shield, Bell, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function TalentSettingsPage() {
  const router = useRouter()
  const { logout } = useAuth()
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handleChangePassword = async () => {
    setIsRedirecting(true)
    try {
      // Logout user first
      await logout()
      
      // Then redirect to forgot password
      toast.success('Redirecting to password reset...')
      router.push('/talent/forgot-password')
    } catch (error) {
      toast.error('Failed to logout. Please try again.')
      setIsRedirecting(false)
    }
  }

  const settingsOptions = [
    {
      id: 'change-password',
      title: 'Change Password',
      description: 'Update your account password (requires logout)',
      icon: Key,
      action: handleChangePassword,
      category: 'Security',
      isLoading: isRedirecting
    }
  ]

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base mt-1">
            Manage your account preferences and security settings
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-900/5 dark:ring-slate-700 rounded-xl p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-slate-500" />
              Security Settings
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your account security and password settings
            </p>
          </div>

          <div className="space-y-4">
            {settingsOptions.map((option) => {
              const IconComponent = option.icon
              return (
                <div
                  key={option.id}
                  className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  onClick={option.action}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">
                        {option.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <button
                    className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    onClick={option.action}
                    disabled={option.isLoading}
                  >
                    {option.isLoading && (
                      <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    )}
                    {option.isLoading ? 'Redirecting...' : 'Configure'}
                  </button>
                </div>
              )
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-1">
                <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Account Security
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Keep your account secure by using a strong password and enabling security features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}