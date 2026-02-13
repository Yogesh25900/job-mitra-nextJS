import { getAuthToken } from '../cookie';
import axiosInstance from './axios';
import { API } from './endpoints';

export interface JobApplicationData {
  jobId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  currentLocation: string;
  currentJobTitle: string;
  yearsOfExperience: number;
  currentCompany: string;
  noticePeriod: string;
  expectedSalary: string;
  keySkills: string[];
  highestQualification: string;
  relevantCertifications: string[];
  coverLetter: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export interface ApplicationResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

/**
 * Submit job application with multipart form data
 * Token is handled by axios interceptors (server-side)
 * Backend: /api/jobApplication POST
 */
export async function submitJobApplication(
  formData: FormData,token: string
): Promise<ApplicationResponse> {
  try {
    console.log(' [API] submitJobApplication - Posting to', API.JOB_APPLICATION.CREATE);
    
    const response = await axiosInstance.post(
      API.JOB_APPLICATION.CREATE,
      formData,{
        headers: {
                'Authorization': `Bearer ${token}`,
                // Let axios set the Content-Type with boundary
            },
        }
    );
    
    console.log(' [API] submitJobApplication - Success');
    return response.data;
  } catch (error: any) {
    console.error(' [API] submitJobApplication error:', error?.response?.status, error?.response?.data || error?.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to submit application',
      error: error.message,
    };
  }
}

/**
 * Get all applications submitted by the current talent user
 * Backend: /api/jobApplication/talent/my-applications GET
 */
export async function getMyApplications(token: string, page: number = 1, size: number = 5): Promise<ApplicationResponse> {
  try {
    console.log(' [API] getMyApplications - Fetching user applications', {page, size});
    
    const response = await axiosInstance.get(
      API.JOB_APPLICATION.GET_MY_APPLICATIONS,{
          params: {
            page,
            size,
          },
          headers: {
                Authorization: `Bearer ${token}`,
            },
      }
      

    );
    
    console.log(' [API] getMyApplications - Success');
    return response.data;
  } catch (error: any) {
    console.error(' [API] getMyApplications error:', error?.response?.status, error?.response?.data || error?.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch applications',
      error: error.message,
    };
  }
}

/**
 * Get a single application by ID
 * Backend: /api/jobApplication/:id GET
 */
export async function getApplicationById(applicationId: string): Promise<ApplicationResponse> {
  try {
    const token = await getAuthToken();
    
    const response = await axiosInstance.get(
      API.JOB_APPLICATION.GET_BY_ID(applicationId),{
          headers: {
                Authorization: `Bearer ${token}`,
            },
      }
    );
    
    console.log('[API] getApplicationById - Success');
    return response.data;
  } catch (error: any) {
    console.error(' [API] getApplicationById error:', error?.response?.status, error?.response?.data || error?.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch application',
      error: error.message,
    };
  }
}

/**
 * Delete a job application
 * Backend: /api/jobApplication/:id DELETE
 */
export async function deleteJobApplication(applicationId: string, token: string): Promise<ApplicationResponse> {
  try {
    console.log('[API] deleteJobApplication - Deleting application:', applicationId);
    
    const response = await axiosInstance.delete(
      API.JOB_APPLICATION.DELETE(applicationId),{
          headers: {
                Authorization: `Bearer ${token}`,
            },
      }
    );
    
    console.log(' [API] deleteJobApplication - Success');
    return response.data;
  } catch (error: any) {
    console.error(' [API] deleteJobApplication error:', error?.response?.status, error?.response?.data || error?.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete application',
      error: error.message,
    };
  }
}

/**
 * Get applications for a specific job
 * Backend: /api/applications/job/:jobId GET
 */
export async function getApplicationsByJobId(jobId: string, token: string): Promise<ApplicationResponse> {
  try {
    console.log(' [API] getApplicationsByJobId - Fetching applications for job:', jobId);
    
    const response = await axiosInstance.get(
      API.JOB_APPLICATION.GETBYJOBID(jobId),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    console.log(' [API] getApplicationsByJobId - Success');
    return response.data;
  } catch (error: any) {
    console.error(' [API] getApplicationsByJobId error:', error?.response?.status, error?.response?.data || error?.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch job applications',
      error: error.message,
    };
  }
}

/**
 * Get applications with AI match score for a specific job
 * Backend: /api/applications/job/:jobId/with-score GET
 */
export async function getApplicationsByJobIdWithScore(jobId: string): Promise<ApplicationResponse> {
  try {
    const token = await getAuthToken();
    console.log(' [API] getApplicationsByJobIdWithScore - Fetching applications with score for job:', jobId);
    
    const response = await axiosInstance.get(
      API.JOB_APPLICATION.GETBYJOBID_WITH_SCORE(jobId),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    console.log('[API] getApplicationsByJobIdWithScore - Success');
    return response.data;
  } catch (error: any) {
    console.error(' [API] getApplicationsByJobIdWithScore error:', error?.response?.status, error?.response?.data || error?.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch job applications with score',
      error: error.message,
    };
  }
}

/**
 * Update application status
 * Backend: /api/applications/:id/status PATCH
 */
export async function updateApplicationStatus(
  applicationId: string,
  status: 'Pending' | 'Reviewing' | 'Shortlisted' | 'Rejected' | 'Accepted',
): Promise<ApplicationResponse> {
  try {
            const token = await getAuthToken();
            
            if (!token) {
                return {
                    success: false,
                    message: 'Authentication token not found. Please log in again.'
                };
            }
            
    console.log('[API] updateApplicationStatus - Updating application:', applicationId, 'Status:', status);
    
    const response = await axiosInstance.patch(
      API.JOB_APPLICATION.UPDATESTATUS(applicationId),
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    console.log('[API] updateApplicationStatus - Success');
    return response.data;
  } catch (error: any) {
    console.error('[API] updateApplicationStatus error:', error?.response?.status, error?.response?.data || error?.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update application status',
      error: error.message,
    };
  }
}
