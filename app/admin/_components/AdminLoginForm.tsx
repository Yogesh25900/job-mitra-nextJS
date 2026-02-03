"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { z } from "zod"
import { useAuth } from "@/context/AuthContext"
import { handleAdminLogin } from "@/lib/actions/admin/admin-actions"

const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type AdminLoginInput = z.infer<typeof adminLoginSchema>

export default function AdminLoginForm() {
  const router = useRouter()
  const { refetchAuth } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: AdminLoginInput) => {
    setIsLoading(true)
    try {
      const response = await handleAdminLogin(data)
      console.log('1. handleAdminLogin response:', response)

      if (response && response.success) {
        toast.success(response.message || "Admin login successful!")
        console.log('2. Login successful, user data:', response.data)
        
        // Wait for cookies to be set
        console.log('3. Waiting 800ms for cookies...')
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Manually refetch auth to update the context with new user data
        console.log('4. Calling refetchAuth...')
        await refetchAuth()
        console.log('5. refetchAuth completed')
        
        // Wait for state to update
        console.log('6. Waiting 800ms for state update...')
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Navigate to admin
        console.log('7. Navigating to /admin')
        router.push("/admin")
        console.log('8. Navigation initiated')
      } else {
        toast.error(response?.message || "Login failed. Please try again.")
        console.error("Login failed:", response)
      }
    } catch (error: any) {
      console.error("Login error:", error)
      toast.error(error.message || "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          Admin Login
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Sign in to admin dashboard
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="admin@example.com"
            {...form.register("email")}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
          />
          {form.formState.errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...form.register("password")}
              className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {isLoading ? "Logging in..." : "Sign In"}
        </button>
      </form>

      {/* Footer Links */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Go back to{" "}
          <Link href="/login" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
            user login
          </Link>
        </p>
      </div>
    </div>
  )
}
