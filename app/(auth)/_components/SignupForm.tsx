"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Check, X } from "lucide-react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import {
  signupTalentSchema,
  signupRecruiterSchema,
  type SignupTalentInput,
  type SignupRecruiterInput,
} from "@/app/(auth)/schema"
import { handleRecruiterRegister, handleTalentRegister } from "@/lib/actions/auth-action"

type UserType = "Talent" | "Recruiter"

interface PasswordStrength {
  length: boolean
  uppercase: boolean
  number: boolean
  special: boolean
}

export default function SignupForm() {
  const router = useRouter()
  const [userType, setUserType] = useState<UserType>("Talent")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordChecks, setPasswordChecks] = useState<PasswordStrength>({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  })

  // Separate form instances for Talent and Recruiter
  const talentForm = useForm<SignupTalentInput>({
    resolver: zodResolver(signupTalentSchema),
    defaultValues: {
      fname: "",
      lname: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      password: "",
      confirmPassword: "",
    },
  })

  const recruiterForm = useForm<SignupRecruiterInput>({
    resolver: zodResolver(signupRecruiterSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  })

  // Select active form based on user type
  const activeForm = userType === "Talent" ? talentForm : recruiterForm

  const checkPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    }
    setPasswordChecks(checks)
    
    const strength = Object.values(checks).filter(Boolean).length * 25
    setPasswordStrength(strength)
  }

  const onSubmit = async (data: SignupTalentInput | SignupRecruiterInput) => {
    setIsLoading(true)
    try {
      let response;
      
      if (userType === "Talent") {
        const talentData = data as SignupTalentInput;
        response = await handleTalentRegister(talentData as any)
        console.log('Talent registration response:', response);
      } else {
        const recruiterData = data as SignupRecruiterInput;
        response = await handleRecruiterRegister(recruiterData as any)
        console.log('Recruiter registration response:', response);
      }
      
      // Check if response indicates success
      if (response && response.success) {
        toast.success(response.message || "Account created successfully!")
        // Redirect to login or dashboard
        router.push("/login")
      } else {
        // Handle failed response
        toast.error(response?.message || "Registration failed. Please try again.")
        console.error("Registration failed:", response)
      }
    } catch (error: any) {
      console.error("Signup error:", error)
      toast.error(error.message || "Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserTypeChange = (type: UserType) => {
    // Reset both forms when switching
    talentForm.reset()
    recruiterForm.reset()
    setUserType(type)
    setShowPassword(false)
    setShowConfirmPassword(false)
    setPasswordStrength(0)
    setPasswordChecks({
      length: false,
      uppercase: false,
      number: false,
      special: false,
    })
  }

  const getStrengthColor = () => {
    if (passwordStrength >= 75) return "bg-green-500"
    if (passwordStrength >= 50) return "bg-yellow-500"
    if (passwordStrength >= 25) return "bg-orange-500"
    return "bg-red-500"
  }

  const getStrengthText = () => {
    if (passwordStrength >= 75) return "Strong"
    if (passwordStrength >= 50) return "Medium"
    if (passwordStrength >= 25) return "Weak"
    return "Very Weak"
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-6xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col md:flex-row">
        {/* Left Side - Images */}
        <div className="hidden md:block md:w-1/2 relative overflow-hidden h-[600px] lg:h-auto">
          <div
            className="flex w-[200%] transition-transform duration-700 ease-in-out h-full"
            style={{
              transform: userType === "Talent" ? "translateX(0%)" : "translateX(-50%)",
            }}
          >
            {/* Talent Image */}
            <div className="w-1/2 flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
              <img
                src="https://img.freepik.com/premium-vector/man-sits-bench-reads-word-lg_1314854-10102.jpg"
                alt="Talent Illustration"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Recruiter Image */}
            <div className="w-1/2 flex items-center justify-center h-full bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-800 dark:to-gray-900">
              <img
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Recruiter Illustration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 overflow-y-auto max-h-[90vh]">
          <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Join us today!
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

          {/* Signup Form */}
          <form 
            onSubmit={activeForm.handleSubmit((data) => onSubmit(data))} 
            className="space-y-4"
          >
            {/* Talent-specific fields */}
            {userType === "Talent" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="First Name"
                      {...talentForm.register("fname")}
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                    {talentForm.formState.errors.fname && (
                      <p className="text-red-500 text-sm mt-1">
                        {talentForm.formState.errors.fname.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Last Name"
                      {...talentForm.register("lname")}
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                    {talentForm.formState.errors.lname && (
                      <p className="text-red-500 text-sm mt-1">
                        {talentForm.formState.errors.lname.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <input
                    type="date"
                    {...talentForm.register("dateOfBirth")}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                  {talentForm.formState.errors.dateOfBirth && (
                    <p className="text-red-500 text-sm mt-1">
                      {talentForm.formState.errors.dateOfBirth.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Recruiter-specific fields */}
            {userType === "Recruiter" && (
              <>
                <div>
                  <input
                    type="text"
                    placeholder="Company Name"
                    {...recruiterForm.register("companyName")}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                  {recruiterForm.formState.errors.companyName && (
                    <p className="text-red-500 text-sm mt-1">
                      {recruiterForm.formState.errors.companyName.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Contact Person Name"
                    {...recruiterForm.register("contactName")}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                  {recruiterForm.formState.errors.contactName && (
                    <p className="text-red-500 text-sm mt-1">
                      {recruiterForm.formState.errors.contactName.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Common fields */}
            <div>
              <input
                type="email"
                placeholder="Email"
                {...(userType === "Talent" ? talentForm.register("email") : recruiterForm.register("email"))}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              {(userType === "Talent" ? talentForm.formState.errors.email : recruiterForm.formState.errors.email) && (
                <p className="text-red-500 text-sm mt-1">
                  {(userType === "Talent" ? talentForm.formState.errors.email?.message : recruiterForm.formState.errors.email?.message)}
                </p>
              )}
            </div>

            <div>
              <input
                type="tel"
                placeholder="Phone Number (10 digits)"
                {...(userType === "Talent" ? talentForm.register("phoneNumber") : recruiterForm.register("phoneNumber"))}
                maxLength={10}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              {(userType === "Talent" ? talentForm.formState.errors.phoneNumber : recruiterForm.formState.errors.phoneNumber) && (
                <p className="text-red-500 text-sm mt-1">
                  {(userType === "Talent" ? talentForm.formState.errors.phoneNumber?.message : recruiterForm.formState.errors.phoneNumber?.message)}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...(userType === "Talent" ? talentForm.register("password", {
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => checkPasswordStrength(e.target.value),
                  }) : recruiterForm.register("password", {
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => checkPasswordStrength(e.target.value),
                  }))}
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

              {/* Password Strength Indicator */}
              {((userType === "Talent" && talentForm.watch("password")) || (userType === "Recruiter" && recruiterForm.watch("password"))) && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Password Strength:
                    </span>
                    <span className={`text-xs font-medium ${
                      passwordStrength >= 75 ? 'text-green-500' :
                      passwordStrength >= 50 ? 'text-yellow-500' :
                      passwordStrength >= 25 ? 'text-orange-500' : 'text-red-500'
                    }`}>
                      {getStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 space-y-1">
                    {[
                      { key: 'length', label: 'At least 8 characters' },
                      { key: 'uppercase', label: 'One uppercase letter' },
                      { key: 'number', label: 'One number' },
                      { key: 'special', label: 'One special character (!@#$%^&*)' },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-2 text-xs">
                        {passwordChecks[key as keyof PasswordStrength] ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                        <span className={passwordChecks[key as keyof PasswordStrength] ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(userType === "Talent" ? talentForm.formState.errors.password : recruiterForm.formState.errors.password) && (
                <p className="text-red-500 text-sm mt-1">
                  {(userType === "Talent" ? talentForm.formState.errors.password?.message : recruiterForm.formState.errors.password?.message)}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  {...(userType === "Talent" ? talentForm.register("confirmPassword") : recruiterForm.register("confirmPassword"))}
                  className="w-full p-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {(userType === "Talent" ? talentForm.formState.errors.confirmPassword : recruiterForm.formState.errors.confirmPassword) && (
                <p className="text-red-500 text-sm mt-1">
                  {(userType === "Talent" ? talentForm.formState.errors.confirmPassword?.message : recruiterForm.formState.errors.confirmPassword?.message)}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || activeForm.formState.isSubmitting}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading || activeForm.formState.isSubmitting ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
