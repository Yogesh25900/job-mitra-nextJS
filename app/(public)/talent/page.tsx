'use client'

import { useEffect, useState } from 'react'
import { Sunrise, Sun, Sunset, Moon } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import ProtectedDashboardRoute from '@/components/ProtectedDashboardRoute'
import RecommendedJobs from '../jobs/_components/RecommendedJobs'
import PremiumBanner from "./_components/PremiumBanner"
import StatCard from "./_components/StatCard"
import { getMyApplicationStats, type MyApplicationStats } from '@/lib/api/applications'

interface GreetingState {
  greeting: string;
  icon: React.ReactNode;
}

function TalentDashboardContent() {
  const { user, token } = useAuth()
  const firstName = user?.fname || 'there'
  const [stats, setStats] = useState<MyApplicationStats>({
    totalApplications: 0,
    shortlisted: 0,
    rejected: 0,
  })
  const [greetingState, setGreetingState] = useState<GreetingState>({
    greeting: "Good Morning",
    icon: <Sunrise className="w-10 h-10 text-orange-500" />,
  })

  // Determine greeting based on time of day
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours()
      let greeting = "Good Morning"
      let icon = <Sunrise className="w-10 h-10 text-orange-500" />

      if (hour >= 12 && hour < 17) {
        greeting = "Good Afternoon"
        icon = <Sun className="w-10 h-10 text-yellow-500" />
      } else if (hour >= 17 && hour < 21) {
        greeting = "Good Evening"
        icon = <Sunset className="w-10 h-10 text-orange-600" />
      } else if (hour >= 21 || hour < 5) {
        greeting = "Good Night"
        icon = <Moon className="w-10 h-10 text-indigo-500" />
      }

      setGreetingState({ greeting, icon })
    }

    updateGreeting()
    // Update greeting every minute
    const interval = setInterval(updateGreeting, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        return
      }

      const response = await getMyApplicationStats(token)
      if (response.success && response.data) {
        setStats({
          totalApplications: Number(response.data.totalApplications || 0),
          shortlisted: Number(response.data.shortlisted || 0),
          rejected: Number(response.data.rejected || 0),
        })
      }
    }

    fetchStats()
  }, [token])

  return (
    <div className="flex flex-col w-full max-w-[1200px] mx-auto px-4 md:px-8 py-6 gap-8">
      {/* Greeting Section */}
      <div className="mb-2">
        <div className="flex items-center gap-3">
          {greetingState.icon}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {greetingState.greeting}, <span className="text-blue-600 dark:text-blue-400">{firstName}</span>
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Welcome Heading & Stats */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-slate-600 dark:text-slate-300 text-base">
            Here's what's happening with your job applications today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Applications"
            value={stats.totalApplications}
            icon="folder_open"
            bgColor="bg-blue-50 dark:bg-blue-900/20"
            iconColor="text-primary"
          />
          <StatCard
            label="Shortlisted"
            value={stats.shortlisted}
            icon="calendar_month"
            bgColor="bg-purple-50 dark:bg-purple-900/20"
            iconColor="text-purple-600 dark:text-purple-400"
          />
          <StatCard
            label="Rejected Applications"
            value={stats.rejected}
            icon="visibility"
            bgColor="bg-green-50 dark:bg-green-900/20"
            iconColor="text-green-600 dark:text-green-400"
          />
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-10">
        {/* Left Column: Recommended Jobs */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          <RecommendedJobs />
        </div>

        {/* Right Column: Premium */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <PremiumBanner />
        </div>
      </div>
    </div>
  )
}

export default function TalentDashboard() {
  return (
    <ProtectedDashboardRoute allowedRole="candidate">
      <TalentDashboardContent />
    </ProtectedDashboardRoute>
  )
}