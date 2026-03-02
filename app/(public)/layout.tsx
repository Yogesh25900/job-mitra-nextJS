"use client";

import { usePathname } from "next/navigation";
import GloablHeader from "./_components/GlobalHeader";
import { ToastProvider } from './_components/ToastProvider';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't show header on dashboard pages
  const isDashboard = pathname.startsWith('/talent') || pathname.startsWith('/employer');

  return (
    <ToastProvider>
      {!isDashboard && <GloablHeader />}
      {children}
    </ToastProvider>
  );
}
