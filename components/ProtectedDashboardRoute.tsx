"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface ProtectedDashboardRouteProps {
  children: ReactNode;
  allowedRole?: "candidate" | "employer";
}

export default function ProtectedDashboardRoute({
  children,
  allowedRole,
}: ProtectedDashboardRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Check role if specified
    if (allowedRole && user?.role !== allowedRole) {
      // Redirect to the correct dashboard based on user role
      if (user?.role === "candidate") {
        router.push("/talent");
      } else if (user?.role === "employer") {
        router.push("/employer");
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, user, loading, allowedRole, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
