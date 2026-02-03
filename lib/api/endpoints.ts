export const API = {
    AUTH: {
        TALENT: {
            LOGIN: '/api/talentusers/login',
            REGISTER: '/api/talentusers/register',
            EDITPROFILE: '/api/talentusers',
            GETPROFILEBYID: '/api/talentusers',
            GETPROFILEMYSELF: '/api/talentusers/profile/me',
            UPLOADPHOTO: '/api/talentusers/upload-photo',
        },
        RECRUITER: {
            LOGIN: '/api/employerusers/login',
            REGISTER: '/api/employerusers/register',
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
    JOB: {
        GETALLJOBS: '/api/jobs',
        GETJOBBYID: (id: string) => `/api/jobs/${id}`,
        SEARCHJOBS: '/api/jobs/search',
        CREATEJOB: '/api/jobs',
        UPDATEJOB: (id: string) => `/api/jobs/${id}`,
        DELETEJOB: (id: string) => `/api/jobs/${id}`,
        GETMYJOBS: '/api/jobs/employer/my-jobs',
    }
}
