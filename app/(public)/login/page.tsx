"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { GoogleLogin, CredentialResponse } from "@react-oauth/google"
import toast from "react-hot-toast"

type UserRole = "candidate" | "employer"

export default function LoginForm() {
  const router = useRouter()

  const [userType, setUserType] = useState<"Talent" | "Recruiter">("Talent")
  const [candidateForm, setCandidateForm] = useState({ email: "", password: "" })
  const [employerForm, setEmployerForm] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState<Record<UserRole, boolean>>({
    candidate: false,
    employer: false,
  })

  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const [forgotPasswordUserType, setForgotPasswordUserType] =
    useState<UserRole>("candidate")

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    role: UserRole
  ) => {
    const { name, value } = e.target
    role === "candidate"
      ? setCandidateForm({ ...candidateForm, [name]: value })
      : setEmployerForm({ ...employerForm, [name]: value })
  }

  const handleSubmit = async (
    e: React.FormEvent,
    role: UserRole
  ) => {
    e.preventDefault()

    const form = role === "candidate" ? candidateForm : employerForm

    if (!validateEmail(form.email)) {
      toast.error("Invalid email format")
      return
    }

    // 🔹 TEMP SKIP API
    toast.success("Login successful (mock)")
    router.push("/")
  }

  const handleGoogleLogin = (
    response: CredentialResponse,
    role: UserRole
  ) => {
    if (!response.credential) {
      toast.error("Google login failed")
      return
    }

    // 🔹 TEMP SKIP API
    toast.success("Google login successful (mock)")
    router.push("/")
  }

  const activeForm = userType === "Talent" ? candidateForm : employerForm
  const role: UserRole = userType === "Talent" ? "candidate" : "employer"

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-6xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col md:flex-row">

        {/* IMAGE */}
        <div className="hidden md:block md:w-1/2 overflow-hidden">
          <img
            src={
              userType === "Talent"
                ? "https://img.freepik.com/premium-vector/man-sits-bench-reads-word-lg_1314854-10102.jpg"
                : "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg"
            }
            className="h-full w-full object-cover"
          />
        </div>

        {/* FORM */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-2xl font-bold mb-4">Welcome back!</h1>

          {/* TOGGLE */}
          <div className="flex bg-gray-200 rounded-lg p-1 mb-6">
            {["Talent", "Recruiter"].map((type) => (
              <button
                key={type}
                onClick={() => setUserType(type as any)}
                className={`flex-1 py-2 rounded ${
                  userType === type
                    ? "bg-white shadow"
                    : "text-gray-500"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => handleSubmit(e, role)}
            className="space-y-4"
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={activeForm.email}
              onChange={(e) => handleChange(e, role)}
              className="w-full p-3 rounded border"
              required
            />

            <div className="relative">
              <input
                type={showPassword[role] ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={activeForm.password}
                onChange={(e) => handleChange(e, role)}
                className="w-full p-3 rounded border"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword({ ...showPassword, [role]: !showPassword[role] })
                }
                className="absolute right-3 top-3"
              >
                {showPassword[role] ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <button className="w-full bg-primary text-white py-3 rounded">
              Login
            </button>
          </form>

          {/* GOOGLE */}
          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={(res) => handleGoogleLogin(res, role)}
              onError={() => toast.error("Google Login Failed")}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
