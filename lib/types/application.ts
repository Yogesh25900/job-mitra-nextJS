export interface Job {
  _id: string
  jobTitle: string
  companyName: string
  jobLocation: string
  jobType: string
  experienceLevel: string
  jobDescription: string
  applicationDeadline: string
  responsibilities: string[]
  qualifications: string[]
  tags: string[]
  companyProfilePicPath?: string
  status: string
  employerId: string
  createdAt: string
  updatedAt: string
}

export interface Employer {
  _id: string
  companyName: string
  email: string
  phoneNumber: string
  website: string
  industry: string
  location: string
  companySize: string
  description: string
  contactName: string
  contactEmail: string
  logoPath: string
  role: string
  isEmailVerified: boolean
  googleProfilePicture: string
  socialLinks?: {
    linkedin: string
    facebook: string
    twitter: string
  }
  createdAt: string
  updatedAt: string
}

export interface JobApplication {
  _id: string
  jobId: Job | string
  talentId: string
  employerId: Employer | string
  fullName: string
  email: string
  phoneNumber: string
  currentLocation: string
  currentJobTitle: string
  yearsOfExperience: number
  currentCompany: string
  noticePeriod: string
  expectedSalary?: string
  keySkills: string[]
  highestQualification: string
  relevantCertifications: string[]
  resumePath?: string
  coverLetterPath?: string
  portfolioUrl?: string
  linkedinUrl?: string
  githubUrl?: string
  status: 'Pending' | 'Reviewing' | 'Shortlisted' | 'Rejected' | 'Accepted'
  appliedAt: string
  updatedAt: string
  createdAt: string
}
