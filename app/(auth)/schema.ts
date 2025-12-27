import { z } from "zod"

// Password validation schema
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[!@#$%^&*]/, "Password must contain at least one special character")

// Phone number validation
const phoneSchema = z
  .string()
  .regex(/^\d{10}$/, "Phone number must be exactly 10 digits")

// Email validation
const emailSchema = z
  .string()
  .email("Invalid email format")
  .min(1, "Email is required")

// Login validation schemas
export const loginTalentSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
})

export const loginRecruiterSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
})

// Signup validation schemas
export const signupTalentSchema = z
  .object({
    fname: z.string().min(2, "First name must be at least 2 characters"),
    lname: z.string().min(2, "Last name must be at least 2 characters"),
    email: emailSchema,
    phoneNumber: phoneSchema,
    dateOfBirth: z.date(),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const signupRecruiterSchema = z
  .object({
    companyName: z.string().min(2, "Company name must be at least 2 characters"),
    contactName: z.string().min(2, "Contact name must be at least 2 characters"),
    email: emailSchema,
    phoneNumber: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

// Type exports
export type LoginTalentInput = z.infer<typeof loginTalentSchema>
export type LoginRecruiterInput = z.infer<typeof loginRecruiterSchema>
export type SignupTalentInput = z.infer<typeof signupTalentSchema>
export type SignupRecruiterInput = z.infer<typeof signupRecruiterSchema>
