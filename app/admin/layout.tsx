"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AdminSideBar from "./_components/AdminSideBar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const isLoginRoute = pathname === "/admin/login";
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const storedTheme = localStorage.getItem("theme");

    const applyTheme = (theme: string | null) => {
      if (theme === "dark") {
        root.classList.add("dark");
        setIsDark(true);
      } else if (theme === "light") {
        root.classList.remove("dark");
        setIsDark(false);
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.toggle("dark", prefersDark);
        setIsDark(prefersDark);
      }
    };

    applyTheme(storedTheme);

    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  if (isLoginRoute) {
    return <>{children}</>;
  }

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-200">
      <AdminSideBar />
      <div className="flex-1 min-w-0 overflow-y-auto transition-colors duration-200">
        {children}
      </div>
    </div>
  );
}
