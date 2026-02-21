'use client'

import { redirect } from 'next/navigation'

export default function EmployerMyJobsPage() {
  // Redirect to the main employer dashboard which shows "My Jobs"
  redirect('/employer')
}
