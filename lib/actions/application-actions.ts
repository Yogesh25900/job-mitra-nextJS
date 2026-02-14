"use server";

import { submitJobApplication } from "@/lib/api/applications";
import { getAuthToken, getUserData } from "@/lib/cookie";

export interface JobApplicationData {
  jobId: string;
  talentId: string;
  employerId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  currentLocation: string;
  currentJobTitle: string;
  yearsOfExperience: number;
  currentCompany: string;
  noticePeriod: string;
  expectedSalary?: string;
  keySkills: string[];
  highestQualification: string;
  relevantCertifications: string[];
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

/**
 * Handle job application submission
 * Pattern: UI → Action → API
 * Auth: Gets token and user from server-side cookies
 * Backend: POST /api/jobApplication (requires talentId, employerId)
 */
export const handleSubmitJobApplication = async (
  applicationData: Omit<JobApplicationData, 'talentId'>,
  resumeFile?: File,
  coverLetterFile?: File
) => {
  try {
    // Get auth token and user data from server-side cookies
    const token = await getAuthToken();
    const userData = await getUserData();
    
    if (!token || !userData) {
      return {
        success: false,
        message: "Authentication required. Please login first.",
      };
    }

    if (!applicationData.employerId) {
      return {
        success: false,
        message: "Unable to determine employer for this job",
      };
    }

    console.log(' [ACTION] handleSubmitJobApplication - Building FormData');
    
    // Build FormData for multipart request
    const formData = new FormData();
    
    // Add required fields with talentId and employerId
    formData.append("jobId", applicationData.jobId);
    formData.append("talentId", userData._id);
    formData.append("employerId", applicationData.employerId);
    
    // Personal Information
    formData.append("fullName", applicationData.fullName);
    formData.append("email", applicationData.email);
    formData.append("phoneNumber", applicationData.phoneNumber);
    formData.append("currentLocation", applicationData.currentLocation);
    
    // Professional Details
    formData.append("currentJobTitle", applicationData.currentJobTitle);
    formData.append("yearsOfExperience", applicationData.yearsOfExperience.toString());
    formData.append("currentCompany", applicationData.currentCompany);
    formData.append("noticePeriod", applicationData.noticePeriod);
    
    if (applicationData.expectedSalary) {
      formData.append("expectedSalary", applicationData.expectedSalary);
    }
    
    // Skills & Qualifications
    formData.append("keySkills", JSON.stringify(applicationData.keySkills));
    formData.append("highestQualification", applicationData.highestQualification);
    formData.append("relevantCertifications", JSON.stringify(applicationData.relevantCertifications));
    
    // Optional URL fields
    if (applicationData.portfolioUrl) {
      formData.append("portfolioUrl", applicationData.portfolioUrl);
    }
    if (applicationData.linkedinUrl) {
      formData.append("linkedinUrl", applicationData.linkedinUrl);
    }
    if (applicationData.githubUrl) {
      formData.append("githubUrl", applicationData.githubUrl);
    }
    
    // Add resume file (required)
    if (resumeFile) {
      formData.append("resume", resumeFile);
      console.log('📎 [ACTION] Resume file added:', resumeFile.name);
    } else {
      return {
        success: false,
        message: "Resume is required",
      };
    }

    // Add cover letter file (optional)
    if (coverLetterFile) {
      formData.append("coverLetterDocument", coverLetterFile);
      console.log('📎 [ACTION] Cover letter file added:', coverLetterFile.name);
    }

    console.log(' [ACTION] handleSubmitJobApplication - Calling API');
    
    // Call API through axios (which will include token via interceptor)
    const response = await submitJobApplication(formData,token);
    
    console.log(' [ACTION] handleSubmitJobApplication - Response:', response);
    
    if (response.success) {
      return {
        success: true,
        message: response.message || "Application submitted successfully",
        data: response.data,
      };
    }
    
    return {
      success: false,
      message: response.message || "Failed to submit application",
    };
  } catch (error: any) {
    console.error(" [ACTION] handleSubmitJobApplication error:", error);
    return {
      success: false,
      message: error.message || "Application submission failed",
    };
  }
};
