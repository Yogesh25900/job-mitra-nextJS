export const API = {
    AUTH: {
        TALENT: {
            LOGIN: '/api/talentusers/login',
            GOOGLE_LOGIN: '/api/talentusers/google-login',
            REGISTER: '/api/talentusers/register',
            EDITPROFILE: '/api/talentusers',
            GETPROFILEBYID: '/api/talentusers',
            GETPROFILEMYSELF: '/api/talentusers/profile/me',
            UPLOADPHOTO: '/api/talentusers/upload-photo',
            PASSWORDRESETOTP: '/api/talentusers/forgot-password',
            VERIFYOTP: '/api/talentusers/verify-otp',
            RESETPASSWORD: '/api/talentusers/reset-password',
        },
        RECRUITER: {
            LOGIN: '/api/employerusers/login',
            GOOGLE_LOGIN: '/api/employerusers/google-login',
            REGISTER: '/api/employerusers/register',
            GETPROFILEBYID: '/api/employerusers',
            EDITPROFILE: '/api/employerusers',
            GETPROFILEMYSELF: '/api/employerusers/profile/me',
            PASSWORDRESETOTP: '/api/employerusers/forgot-password',
            VERIFYOTP: '/api/employerusers/verify-otp',
            RESETPASSWORD: '/api/employerusers/reset-password',
        },
        ADMIN: {
            LOGIN: '/api/admin/login',
        }
    },
    ADMIN:{
        PROFILE: {
            GETME: '/api/admin/profile/me',
            UPDATE: '/api/admin/profile/me',
            CHANGE_PASSWORD: '/api/admin/change-password',
        },
        USER:{
            CREATE: '/api/admin/users',
            GETALLUSERS: '/api/admin/users',
            GETUSERBYID: (id: string) => `/api/admin/users/${id}`,
            UPDATEUSERBYID: (id: string) => `/api/admin/users/${id}`,
            DELETEUSERBYID: (id: string) => `/api/admin/users/${id}`,
        },
        JOB:{
            GETALLJOBS: '/api/jobs',
            GETJOBBYID: (id: string) => `/api/jobs/${id}`,
            CREATE: '/api/jobs',
            UPDATE: (id: string) => `/api/jobs/${id}`,
            DELETE: (id: string) => `/api/jobs/${id}`,
            STATS: '/api/jobs/stats/overview',
        },
        DASHBOARD: {
            GETSTATS: '/api/admin/dashboard/stats',
            GETTRENDS: '/api/admin/dashboard/job-trends',
            GETACTIVITIES: '/api/admin/dashboard/activities',
        }
    },
    CATEGORY: {
        GETALL: '/api/categories',
        GETBYID: (id: string) => `/api/categories/${id}`,
    },
    JOB: {
        GETALLJOBS: '/api/jobs',
        GETJOBBYID: (id: string) => `/api/jobs/${id}`,
        SEARCHJOBS: '/api/jobs/search',
        CREATEJOB: '/api/jobs',
        UPDATEJOB: (id: string) => `/api/jobs/${id}`,
        DELETEJOB: (id: string) => `/api/jobs/${id}`,
        GETMYJOBS: '/api/jobs/employer/my-jobs',

        VIEWSAVEDJOBS: '/api/saved-jobs/list',
    },
    JOB_APPLICATION: {
        CREATE: '/api/applications',
        GETALL: '/api/applications',
        GET_BY_ID: (id: string) => `/api/applications/${id}`,
        GETBYJOBID: (jobId: string) => `/api/applications/job/${jobId}`,
        GETBYJOBID_WITH_SCORE: (jobId: string) => `/api/applications/job/${jobId}/with-score`,
        GET_MY_APPLICATIONS: '/api/applications/talent/my-applications',
        GET_MY_APPLICATION_STATS: '/api/applications/talent/my-stats',
        GETEMPLOYERAPPLICATIONS: '/api/applications/employer/applications',
        UPDATESTATUS: (id: string) => `/api/applications/${id}/status`,
        DELETE: (id: string) => `/api/applications/${id}`,
    },
    FEEDBACK: {
        CREATE: '/api/feedback',
        GET_MY_FEEDBACK: '/api/feedback/my-feedback',
        GET_BY_ID: (id: string) => `/api/feedback/${id}`,
        ADMIN: {
            GETALL: '/api/admin/feedback',
            STATS: '/api/admin/feedback/stats',
            UPDATE: (id: string) => `/api/admin/feedback/${id}`,
            DELETE: (id: string) => `/api/admin/feedback/${id}`,
        }
    }
}
