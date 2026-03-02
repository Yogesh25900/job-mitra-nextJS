"use client";
import { useEffect, useState } from "react";
import { Sunrise, Sun, Sunset, Moon } from "lucide-react";
import ProtectedDashboardRoute from "@/components/ProtectedDashboardRoute"
import JobTable from "./_components/JobTable"
import StatCard from "./_components/StatCard"
import { useAuth } from "@/context/AuthContext";
import { getEmployerJobStats } from "@/lib/api/job";
import { getEmployerApplicationStats } from "@/lib/api/applications";

interface EmployerStats {
  totalJobs: number;
  totalApplicants: number;
  shortlisted: number;
}

interface GreetingState {
  greeting: string;
  icon: React.ReactNode;
}

function EmployerDashboardContent() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState<EmployerStats>({
    totalJobs: 0,
    totalApplicants: 0,
    shortlisted: 0,
  });
  const [greetingState, setGreetingState] = useState<GreetingState>({
    greeting: "Good Morning",
    icon: <Sunrise className="w-10 h-10 text-orange-500" />,
  });

  // Determine greeting based on time of day
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      let greeting = "Good Morning";
      let icon = <Sunrise className="w-10 h-10 text-orange-500" />;

      if (hour >= 12 && hour < 17) {
        greeting = "Good Afternoon";
        icon = <Sun className="w-10 h-10 text-yellow-500" />;
      } else if (hour >= 17 && hour < 21) {
        greeting = "Good Evening";
        icon = <Sunset className="w-10 h-10 text-orange-600" />;
      } else if (hour >= 21 || hour < 5) {
        greeting = "Good Night";
        icon = <Moon className="w-10 h-10 text-indigo-500" />;
      }

      setGreetingState({ greeting, icon });
    };

    updateGreeting();
    // Update greeting every minute
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        return;
      }

      try {
        const [jobStatsRes, appStatsRes] = await Promise.all([
          getEmployerJobStats(),
          getEmployerApplicationStats(token),
        ]);

        if (jobStatsRes?.success && jobStatsRes?.data) {
          const totalJobs = jobStatsRes.data.totalJobs || 0;
          const totalApplicants = appStatsRes?.data?.totalApplicants || 0;
          const shortlisted = appStatsRes?.data?.shortlisted || 0;

          setStats({
            totalJobs,
            totalApplicants,
            shortlisted,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [token]);

  const dashboardStats = [
    {
      title: 'Total Jobs',
      value: stats.totalJobs.toString(),
      trend: 2,
      trendDirection: 'up' as const,
    },
    {
      title: 'Applicants',
      value: stats.totalApplicants.toString(),
      trend: 15,
      trendDirection: 'up' as const,
    },
    {
      title: 'Shortlisted',
      value: stats.shortlisted.toString(),
      trend: 3,
      trendDirection: 'up' as const,
    },
  ]

  const userName = user?.companyName || user?.name || "Recruiter";

  return (
    <div className="p-4 md:p-8 min-w-0">
      {/* Greeting Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          {greetingState.icon}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {greetingState.greeting}, <span className="text-blue-600 dark:text-blue-400">{userName}</span>
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

      {/* Stats Row */}
      <div className="flex flex-wrap gap-4 mb-8">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Job Table */}
      <JobTable />
    </div>
  )
}

export default function Home() {
  return (
    <ProtectedDashboardRoute allowedRole="employer">
      <EmployerDashboardContent />
    </ProtectedDashboardRoute>
  )
}