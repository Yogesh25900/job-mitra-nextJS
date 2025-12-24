"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Check, X } from "lucide-react"

// Import your DOB picker component
type DOBDatePickerProps = {
  value: Date | null
  onChange: (date: Date | null) => void
  placeholder?: string
}

function DOBDatePicker({ value, onChange, placeholder }: DOBDatePickerProps) {
  const formatted = value ? value.toISOString().split("T")[0] : ""

  return (
    <input
      type="date"
      value={formatted}
      onChange={(e) => {
        const nextValue = e.target.value
        onChange(nextValue ? new Date(nextValue) : null)
      }}
      placeholder={placeholder}
      className="w-full p-3 rounded-lg border dark:bg-[#110E1C]/70"
    />
  )
}

// Replace these with your actual signup API calls
async function signupUser(data: any) {
  console.log("Signup Talent:", data)
  return true
}

async function signupEmployer(data: any) {
  console.log("Signup Employer:", data)
  return true
}

// Optional: toast notification library
import { toast } from "react-hot-toast"

export default function SignupPage() {
  const router = useRouter()

  const [userType, setUserType] = useState("Talent")
  const [loading, setLoading] = useState(false)
  const [phoneValid, setPhoneValid] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [emailValid, setEmailValid] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  })

  // Talent Form
  const [talentForm, setTalentForm] = useState({
    fname: "",
    lname: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  })
  const [talentDob, setTalentDob] = useState<Date | null>(null)

  // Recruiter Form
  const [recruiterForm, setRecruiterForm] = useState({
    companyName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    contactName: "",
  })

  const activeForm = userType === "Talent" ? talentForm : recruiterForm

  // Input handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, role: string) => {
    const { name, value } = e.target
    if (role === "talent") {
      setTalentForm({ ...talentForm, [name]: value })
    } else {
      setRecruiterForm({ ...recruiterForm, [name]: value })
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, role: string) => {
    let phone = e.target.value.replace(/\D/g, "")
    if (phone.length > 10) phone = phone.slice(0, 10)
    setPhoneValid(phone.length === 10)

    if (role === "talent") setTalentForm({ ...talentForm, phoneNumber: phone })
    else setRecruiterForm({ ...recruiterForm, phoneNumber: phone })
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>, role: string) => {
    const email = e.target.value
    setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    handleChange(e, role)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>, role: string) => {
    const password = e.target.value
    handleChange(e, role)

    const length = password.length >= 8
    const uppercase = /[A-Z]/.test(password)
    const number = /\d/.test(password)
    const special = /[!@#$%^&*]/.test(password)

    setPasswordChecks({ length, uppercase, number, special })
    setPasswordStrength([length, uppercase, number, special].filter(Boolean).length * 25)
  }

  const confirmPasswordMismatch =
    activeForm.password && activeForm.confirmPassword && activeForm.password !== activeForm.confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const form = activeForm
   const requiredFields =
  userType === "Talent"
    ? [talentForm.fname, talentForm.lname, talentForm.email, talentForm.phoneNumber, talentForm.password, talentForm.confirmPassword]
    : [recruiterForm.companyName, recruiterForm.contactName, recruiterForm.email, recruiterForm.phoneNumber, recruiterForm.password, recruiterForm.confirmPassword]

    if (userType === "Talent") {
  await signupUser({
    ...talentForm,
    dateOfBirth: talentDob ? talentDob.toISOString().split("T")[0] : "",
    roleID: "candidate",
  })
} else {
  await signupEmployer({
    ...recruiterForm,
    roleID: "employer",
  })
}


    if (requiredFields.some((field) => !field)) {
      toast.error("Please fill in all required fields")
      setLoading(false)
      return
    }

    if (!emailValid) {
      toast.error("Please enter a valid email")
      setLoading(false)
      return
    }

    if (!phoneValid) {
      toast.error("Phone number must be exactly 10 digits")
      setLoading(false)
      return
    }

    if (!passwordChecks.length || !passwordChecks.uppercase || !passwordChecks.number || !passwordChecks.special) {
      toast.error("Password does not meet requirements")
      setLoading(false)
      return
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      if (userType === "Talent") {
        await signupUser({
          ...form,
          dateOfBirth: talentDob ? talentDob.toISOString().split("T")[0] : "",
          roleID: "candidate",
        })
        toast.success("Signup successful!")
      } else {
        await signupEmployer({
          ...form,
          roleID: "employer",
        })
        toast.success("Employer account created!")
      }
      router.push("/login")
    } catch (err) {
      toast.error("Signup failed!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-10 sm:pt-32 px-4 bg-white dark:bg-[#110E1C] text-gray-900 dark:text-gray-200">
      <div className="bg-gray-50 dark:bg-[#1E1F55]/40 p-6 sm:p-10 rounded-2xl w-full max-w-md shadow-xl border dark:border-white/10">
        <h2 className="text-3xl font-bold mb-6 text-center">Create Your Account</h2>

        {/* Toggle Talent / Recruiter */}
        <div className="flex bg-gray-200 dark:bg-[#110E1C]/40 rounded-lg p-1 mb-6">
          <button
            onClick={() => setUserType("Talent")}
            className={`flex-1 py-2 rounded-md font-medium ${
              userType === "Talent" ? "bg-blue-600 dark:bg-[#9B7BFF] text-white" : "text-gray-600 dark:text-gray-300"
            }`}
          >
            Talent
          </button>
          <button
            onClick={() => setUserType("Recruiter")}
            className={`flex-1 py-2 rounded-md font-medium ${
              userType === "Recruiter" ? "bg-blue-600 dark:bg-[#9B7BFF] text-white" : "text-gray-600 dark:text-gray-300"
            }`}
          >
            Recruiter
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {userType === "Talent" ? (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="fname"
                  placeholder="First Name"
                  value={talentForm.fname}
                  onChange={(e) => handleChange(e, "talent")}
                  required
                  className="w-full p-3 rounded-lg border dark:bg-[#110E1C]/70"
                />
                <input
                  type="text"
                  name="lname"
                  placeholder="Last Name"
                  value={talentForm.lname}
                  onChange={(e) => handleChange(e, "talent")}
                  required
                  className="w-full p-3 rounded-lg border dark:bg-[#110E1C]/70"
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={talentForm.email}
                onChange={(e) => handleEmailChange(e, "talent")}
                required
                className="w-full p-3 rounded-lg border dark:bg-[#110E1C]/70"
              />
              {activeForm.email && !emailValid && <p className="text-red-500 text-sm">Invalid email format</p>}

              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={talentForm.phoneNumber}
                onChange={(e) => handlePhoneChange(e, "talent")}
                className={`w-full p-3 rounded-lg border dark:bg-[#110E1C]/70 ${!phoneValid ? "border-red-500" : ""}`}
              />
              {!phoneValid && <p className="text-red-500 text-sm">Phone number must be exactly 10 digits</p>}

              <DOBDatePicker value={talentDob} onChange={(date) => setTalentDob(date)} placeholder="Date of Birth" />
            </>
          ) : (
            <>
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={recruiterForm.companyName}
                onChange={(e) => handleChange(e, "recruiter")}
                required
                className="w-full p-3 rounded-lg border dark:bg-[#110E1C]/70"
              />
              <input
                type="text"
                name="contactName"
                placeholder="Contact Person Name"
                value={recruiterForm.contactName}
                onChange={(e) => handleChange(e, "recruiter")}
                className="w-full p-3 rounded-lg border dark:bg-[#110E1C]/70"
              />
              <input
                type="email"
                name="email"
                placeholder="Company Email"
                value={recruiterForm.email}
                onChange={(e) => handleEmailChange(e, "recruiter")}
                required
                className="w-full p-3 rounded-lg border dark:bg-[#110E1C]/70"
              />
              {activeForm.email && !emailValid && <p className="text-red-500 text-sm">Invalid email format</p>}

              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={recruiterForm.phoneNumber}
                onChange={(e) => handlePhoneChange(e, "recruiter")}
                className="w-full p-3 rounded-lg border dark:bg-[#110E1C]/70"
              />
            </>
          )}

          {/* Password Fields */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={activeForm.password}
              onChange={(e) => handlePasswordChange(e, userType === "Talent" ? "talent" : "recruiter")}
              required
              className="w-full p-3 rounded-lg border dark:bg-[#110E1C]/70"
            />
            <span className="absolute right-3 top-4 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {/* Password Strength */}
          <div className="w-full h-2 bg-gray-300 rounded mt-1">
            <div
              className={`h-2 rounded ${
                passwordStrength < 50 ? "bg-red-500" : passwordStrength < 75 ? "bg-yellow-400" : "bg-green-500"
              }`}
              style={{ width: `${passwordStrength}%` }}
            ></div>
          </div>

          {/* Checklist */}
          <ul className="text-sm mt-2">
            <li className={`${passwordChecks.length ? "text-green-600" : "text-gray-500"} flex items-center gap-1`}>
              {passwordChecks.length ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} At least 8 characters
            </li>
            <li className={`${passwordChecks.uppercase ? "text-green-600" : "text-gray-500"} flex items-center gap-1`}>
              {passwordChecks.uppercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} Uppercase letter
            </li>
            <li className={`${passwordChecks.number ? "text-green-600" : "text-gray-500"} flex items-center gap-1`}>
              {passwordChecks.number ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} Number
            </li>
            <li className={`${passwordChecks.special ? "text-green-600" : "text-gray-500"} flex items-center gap-1`}>
              {passwordChecks.special ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} Special character (!@#$%^&*)
            </li>
          </ul>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={activeForm.confirmPassword}
              onChange={(e) => handleChange(e, userType === "Talent" ? "talent" : "recruiter")}
              required
              className="w-full p-3 rounded-lg border dark:bg-[#110E1C]/70"
            />
            <span className="absolute right-3 top-4 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          {confirmPasswordMismatch && <p className="text-red-500 text-sm mt-1">Passwords do not match</p>}

          <button type="submit" disabled={loading} className="w-full py-3 btn-primary">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <span onClick={() => router.push("/login")} className="text-blue-600 cursor-pointer">
            Login
          </span>
        </p>
      </div>
    </div>
  )
}
