export const API = {
    AUTH: {
        TALENT: {
            LOGIN: '/api/talentusers/login',
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
        USER:{
            CREATE: '/api/admin/users',
            GETALLUSERS: '/api/admin/users',
            GETUSERBYID: (id: string) => `/api/admin/users/${id}`,
            UPDATEUSERBYID: (id: string) => `/api/admin/users/${id}`,
            DELETEUSERBYID: (id: string) => `/api/admin/users/${id}`,
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
        GETEMPLOYERAPPLICATIONS: '/api/applications/employer/applications',
        UPDATESTATUS: (id: string) => `/api/applications/${id}/status`,
        DELETE: (id: string) => `/api/applications/${id}`,
    }
}
