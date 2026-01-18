"use client"

import { Toaster } from "react-hot-toast"

// Centralized toast provider so toast notifications render across the app
export function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#111827",
          color: "#F9FAFB",
          border: "1px solid #1F2937",
        },
        success: {
          style: {
            background: "#0F172A",
            borderColor: "#10B981",
            color: "#ECFDF3",
          },
        },
        error: {
          style: {
            background: "#0F172A",
            borderColor: "#EF4444",
            color: "#FEE2E2",
          },
        },
      }}
    />
  )
}
