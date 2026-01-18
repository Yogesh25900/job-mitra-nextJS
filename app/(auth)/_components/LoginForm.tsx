"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { GoogleLogin, CredentialResponse } from "@react-oauth/google"
import toast from "react-hot-toast"
import {
  loginTalentSchema,
  loginRecruiterSchema,
  type LoginTalentInput,
  type LoginRecruiterInput,
} from "@/app/(auth)/schema"
import { handleTalentLogin } from "@/lib/actions/auth-action"

type UserType = "Talent" | "Recruiter"

export default function LoginForm() {
  const router = useRouter()
  const [userType, setUserType] = useState<UserType>("Talent")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Separate form instances for Talent and Recruiter
  const talentForm = useForm<LoginTalentInput>({
    resolver: zodResolver(loginTalentSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const recruiterForm = useForm<LoginRecruiterInput>({
    resolver: zodResolver(loginRecruiterSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Select active form based on user type
  const activeForm = userType === "Talent" ? talentForm : recruiterForm

  const onSubmit = async (data: LoginTalentInput | LoginRecruiterInput) => {
    setIsLoading(true)
    try {
      let response;
      
      if (userType === "Talent") {
        const talentData = data as LoginTalentInput;
        response = await handleTalentLogin(talentData)
        console.log('Talent login response:', response);
      } else {
        // TODO: Implement recruiter login
        toast.error("Recruiter login not yet implemented")
        setIsLoading(false)
        return
      }
      
      // Check if response indicates success
      if (response && response.success) {
        toast.success(response.message || "Login successful!")
        // Redirect based on user role
        router.push("/")
        router.refresh()
      } else {
        // Handle failed response
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

  const handleGoogleLogin = async (response: CredentialResponse) => {
    if (!response.credential) {
      toast.error("Google login failed")
      return
    }

    setIsLoading(true)
 
  }

  const handleUserTypeChange = (type: UserType) => {
    // Reset both forms when switching
    talentForm.reset()
    recruiterForm.reset()
    setUserType(type)
    setShowPassword(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-6xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col md:flex-row">
        {/* Left Side - Images */}
        <div className="hidden md:block md:w-1/2 relative overflow-hidden h-[500px] lg:h-auto">
          <div
            className="flex w-[200%] transition-transform duration-700 ease-in-out h-full"
            style={{
              transform: userType === "Talent" ? "translateX(0%)" : "translateX(-50%)",
            }}
          >
            {/* Talent Image */}
            <div className="w-1/2 flex items-center justify-center h-full">
              <img
                src="https://img.freepik.com/premium-vector/man-sits-bench-reads-word-lg_1314854-10102.jpg"
                alt="Talent Illustration"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Recruiter Image */}
            <div className="w-1/2 flex items-center justify-center h-full">
              <img
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Recruiter Illustration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Welcome back!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Sign in to continue
          </p>

          {/* User Type Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
            {(["Talent", "Recruiter"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleUserTypeChange(type)}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  userType === type
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Login Form */}
          <form
            onSubmit={activeForm.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Email Field */}
            <div>
              <input
                type="email"
                placeholder="Email"
                {...activeForm.register("email")}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              {activeForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {activeForm.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...activeForm.register("password")}
                  className="w-full p-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="mt-2 text-right">
                <Link href="/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              {activeForm.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {activeForm.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || activeForm.formState.isSubmitting}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading || activeForm.formState.isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Google Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => toast.error("Google Login Failed")}
              />
            </div>
          </div>

          {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
