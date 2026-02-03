# JobMitra Backend API Documentation

## Table of Contents
- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Admin Routes](#admin-routes)
- [Talent User Routes](#talent-user-routes)
- [Employer User Routes](#employer-user-routes)
- [Job Routes](#job-routes)
- [Response Format](#response-format)
- [Error Handling](#error-handling)

---

## Overview

JobMitra is a job portal platform with three main user types:
- **Admin**: Platform administrators who manage users and system
- **Talent/Candidate**: Job seekers
- **Employer**: Companies posting job opportunities

---

## Base URL

```
http://localhost:5000/api
```

---

## Authentication

### JWT Token
- All protected routes require a Bearer token in the Authorization header
- Token expires in 24 hours
- Format: `Authorization: Bearer <token>`

### Token Generation
Admin, Talent, and Employer users receive a JWT token upon successful login that includes:
- User ID
- Email
- Role (admin, candidate, employer)

---

# ADMIN ROUTES

**Base URL**: `/api/admin`

## 1. Admin Registration

**Endpoint**: `POST /api/admin/register`

**Authentication**: No

**Description**: Create a new admin account

### Request Body
```json
{
  "email": "admin@jobmitra.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}
```

### Response (201 Created)
```json
{
  "success": true,
  "message": "Admin created successfully",
  "data": {
    "_id": "67b1234567890abcdef12345",
    "email": "admin@jobmitra.com",
    "role": "admin",
    "createdAt": "2026-01-30T10:00:00.000Z",
    "updatedAt": "2026-01-30T10:00:00.000Z"
  }
}
```

---

## 2. Admin Login

**Endpoint**: `POST /api/admin/login`

**Authentication**: No

**Description**: Login as admin and receive JWT token

### Request Body
```json
{
  "email": "admin@jobmitra.com",
  "password": "securePassword123"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "67b1234567890abcdef12345",
    "email": "admin@jobmitra.com",
    "role": "admin",
    "createdAt": "2026-01-30T10:00:00.000Z",
    "updatedAt": "2026-01-30T10:00:00.000Z"
  }
}
```

---

## 3. Create User as Admin

**Endpoint**: `POST /api/admin/users`

**Authentication**: Required (Admin only)

**Description**: Admin can create employer or talent users

### Request Body (Talent User)
```json
{
  "userType": "talent",
  "userData": {
    "email": "john.doe@gmail.com",
    "password": "securePassword123",
    "fname": "John",
    "lname": "Doe",
    "phoneNumber": "+1234567890"
  }
}
```

### Request Body (Employer User)
```json
{
  "userType": "employer",
  "userData": {
    "email": "company@example.com",
    "password": "securePassword123",
    "companyName": "Tech Solutions Inc",
    "contactName": "John Smith",
    "phoneNumber": "+1234567890"
  }
}
```

### Response (201 Created)
```json
{
  "success": true,
  "message": "Talent user created successfully",
  "data": {
    "_id": "67b9876543210fedcba54321",
    "fname": "John",
    "lname": "Doe",
    "email": "john.doe@gmail.com",
    "phoneNumber": "+1234567890",
    "role": "candidate",
    "profilePicturePath": "",
    "createdAt": "2026-01-30T10:05:00.000Z",
    "updatedAt": "2026-01-30T10:05:00.000Z"
  }
}
```

---

## 4. Get All Users

**Endpoint**: `GET /api/admin/users`

**Authentication**: Required (Admin only)

**Description**: Retrieve all users (employers and talents combined)

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "_id": "67b9876543210fedcba54321",
      "fname": "John",
      "lname": "Doe",
      "email": "john.doe@gmail.com",
      "phoneNumber": "+1234567890",
      "role": "candidate",
      "profilePicturePath": "",
      "createdAt": "2026-01-30T10:05:00.000Z",
      "updatedAt": "2026-01-30T10:05:00.000Z"
    },
    {
      "_id": "67b1111111111111111111111",
      "companyName": "Tech Solutions Inc",
      "contactName": "John Smith",
      "email": "company@example.com",
      "phoneNumber": "+1234567890",
      "role": "employer",
      "profilePicturePath": "",
      "createdAt": "2026-01-30T10:00:00.000Z",
      "updatedAt": "2026-01-30T10:00:00.000Z"
    }
  ]
}
```

---

## 5. Get User by ID

**Endpoint**: `GET /api/admin/users/:id`

**Authentication**: Required (Admin only)

**Description**: Retrieve a specific user by ID

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "67b9876543210fedcba54321",
    "fname": "John",
    "lname": "Doe",
    "email": "john.doe@gmail.com",
    "phoneNumber": "+1234567890",
    "role": "candidate",
    "profilePicturePath": "",
    "createdAt": "2026-01-30T10:05:00.000Z",
    "updatedAt": "2026-01-30T10:05:00.000Z"
  }
}
```

---

## 6. Update User by ID

**Endpoint**: `PUT /api/admin/users/:id`

**Authentication**: Required (Admin only)

**Description**: Update any user information

### Request Body
```json
{
  "phoneNumber": "+9876543210",
  "location": "New York, USA"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "67b9876543210fedcba54321",
    "fname": "John",
    "lname": "Doe",
    "email": "john.doe@gmail.com",
    "phoneNumber": "+9876543210",
    "role": "candidate",
    "profilePicturePath": "",
    "createdAt": "2026-01-30T10:05:00.000Z",
    "updatedAt": "2026-01-30T10:15:00.000Z"
  }
}
```

---

## 7. Delete User by ID

**Endpoint**: `DELETE /api/admin/users/:id`

**Authentication**: Required (Admin only)

**Description**: Delete a user from the system

### Response (200 OK)
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

# TALENT USER ROUTES

**Base URL**: `/api/talentusers`

## 1. Register Talent User

**Endpoint**: `POST /api/talentusers/register`

**Authentication**: No

**Description**: Register a new talent/candidate account

### Request Body
```json
{
  "fname": "John",
  "lname": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123",
  "phoneNumber": "+1234567890"
}
```

### Response (201 Created)
```json
{
  "success": true,
  "message": "Talent registered successfully",
  "data": {
    "_id": "67b9876543210fedcba54321",
    "fname": "John",
    "lname": "Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "role": "candidate",
    "profilePicturePath": ""
  }
}
```

---

## 2. Login Talent User

**Endpoint**: `POST /api/talentusers/login`

**Authentication**: No

**Description**: Login as talent and receive JWT token

### Request Body
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "67b9876543210fedcba54321",
    "fname": "John",
    "lname": "Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "role": "candidate",
    "profilePicturePath": ""
  }
}
```

---

## 3. Get All Talents

**Endpoint**: `GET /api/talentusers`

**Authentication**: No

**Description**: Retrieve all talent/candidate profiles

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "_id": "67b9876543210fedcba54321",
      "fname": "John",
      "lname": "Doe",
      "email": "john@example.com",
      "phoneNumber": "+1234567890",
      "role": "candidate",
      "profilePicturePath": ""
    }
  ]
}
```

---

## 4. Get Talent by ID

**Endpoint**: `GET /api/talentusers/:id`

**Authentication**: No

**Description**: Retrieve a specific talent profile

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "67b9876543210fedcba54321",
    "fname": "John",
    "lname": "Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "role": "candidate",
    "profilePicturePath": ""
  }
}
```

---

## 5. Update Talent Profile

**Endpoint**: `PUT /api/talentusers/:id`

**Authentication**: No

**Description**: Update talent profile information

### Request Body
```json
{
  "title": "Senior Software Engineer",
  "location": "San Francisco, CA",
  "summary": "Experienced software engineer with 5+ years in backend development",
  "skills": ["Node.js", "TypeScript", "MongoDB", "Express.js"],
  "experiences": [
    {
      "title": "Senior Engineer",
      "company": "Tech Corp",
      "period": "2021-Present",
      "location": "San Francisco",
      "description": "Leading backend team",
      "isCurrent": true
    }
  ],
  "education": [
    {
      "degree": "Bachelor of Science",
      "institution": "University of Technology",
      "period": "2016-2020"
    }
  ]
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Talent updated successfully",
  "data": {
    "_id": "67b9876543210fedcba54321",
    "fname": "John",
    "lname": "Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "role": "candidate",
    "profilePicturePath": "",
    "title": "Senior Software Engineer",
    "location": "San Francisco, CA",
    "skills": ["Node.js", "TypeScript", "MongoDB", "Express.js"]
  }
}
```

---

## 6. Upload Talent Profile Photo

**Endpoint**: `POST /api/talentusers/upload-photo`

**Authentication**: Required

**Description**: Upload a profile picture for talent user

### Request
- Method: POST
- Content-Type: multipart/form-data
- File field name: `profilePicture`

### Response (200 OK)
```json
{
  "success": true,
  "data": "filename-123456.jpg",
  "message": "Profile photo uploaded successfully"
}
```

---

# EMPLOYER USER ROUTES

**Base URL**: `/api/employerusers`

## 1. Register Employer

**Endpoint**: `POST /api/employerusers/register`

**Authentication**: No

**Description**: Register a new employer/company account

### Request Body
```json
{
  "companyName": "Tech Solutions Inc",
  "email": "hr@techsolutions.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123",
  "phoneNumber": "+1234567890",
  "contactName": "Jane Smith",
  "industry": "Software Development",
  "location": "San Francisco, CA"
}
```

### Response (201 Created)
```json
{
  "success": true,
  "message": "Employer registered successfully",
  "data": {
    "_id": "67b1111111111111111111111",
    "companyName": "Tech Solutions Inc",
    "contactName": "Jane Smith",
    "email": "hr@techsolutions.com",
    "phoneNumber": "+1234567890",
    "role": "employer",
    "profilePicturePath": ""
  }
}
```

---

## 2. Login Employer

**Endpoint**: `POST /api/employerusers/login`

**Authentication**: No

**Description**: Login as employer and receive JWT token

### Request Body
```json
{
  "email": "hr@techsolutions.com",
  "password": "securePassword123"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "67b1111111111111111111111",
    "companyName": "Tech Solutions Inc",
    "contactName": "Jane Smith",
    "email": "hr@techsolutions.com",
    "phoneNumber": "+1234567890",
    "role": "employer",
    "profilePicturePath": ""
  }
}
```

---

## 3. Get All Employers

**Endpoint**: `GET /api/employerusers`

**Authentication**: No

**Description**: Retrieve all employer/company profiles

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "_id": "67b1111111111111111111111",
      "companyName": "Tech Solutions Inc",
      "contactName": "Jane Smith",
      "email": "hr@techsolutions.com",
      "phoneNumber": "+1234567890",
      "role": "employer",
      "profilePicturePath": ""
    }
  ]
}
```

---

## 4. Get Employer by ID

**Endpoint**: `GET /api/employerusers/:id`

**Authentication**: No

**Description**: Retrieve a specific employer profile

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "67b1111111111111111111111",
    "companyName": "Tech Solutions Inc",
    "contactName": "Jane Smith",
    "email": "hr@techsolutions.com",
    "phoneNumber": "+1234567890",
    "role": "employer",
    "profilePicturePath": ""
  }
}
```

---

## 5. Update Employer Profile

**Endpoint**: `PUT /api/employerusers/:id`

**Authentication**: No

**Description**: Update employer profile information

### Request Body
```json
{
  "phoneNumber": "+9876543210",
  "website": "https://techsolutions.com",
  "industry": "Software Development",
  "location": "New York, USA",
  "companySize": "50-100",
  "description": "Leading software development company",
  "contactEmail": "info@techsolutions.com",
  "socialLinks": {
    "linkedin": "https://linkedin.com/company/techsolutions",
    "facebook": "https://facebook.com/techsolutions",
    "twitter": "https://twitter.com/techsolutions"
  }
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Employer updated successfully",
  "data": {
    "_id": "67b1111111111111111111111",
    "companyName": "Tech Solutions Inc",
    "contactName": "Jane Smith",
    "email": "hr@techsolutions.com",
    "phoneNumber": "+9876543210",
    "role": "employer",
    "profilePicturePath": "",
    "website": "https://techsolutions.com"
  }
}
```

---

# JOB ROUTES

**Base URL**: `/api/jobs`

## 1. Create Job

**Endpoint**: `POST /api/jobs`

**Authentication**: Required (Employer only)

**Description**: Create a new job posting

### Request Body
```json
{
  "jobTitle": "Senior Backend Engineer",
  "companyName": "Tech Solutions Inc",
  "jobLocation": "San Francisco, CA",
  "jobType": "Full-Time",
  "experienceLevel": "Senior (5+ years)",
  "jobCategory": "Software Development",
  "jobDescription": "We are looking for an experienced backend engineer to join our team...",
  "applicationDeadline": "2026-02-28",
  "responsibilities": [
    "Design and develop scalable backend systems",
    "Lead a team of junior engineers",
    "Mentor junior developers"
  ],
  "qualifications": [
    "5+ years of backend development experience",
    "Proficiency in Node.js and TypeScript",
    "Experience with MongoDB and databases",
    "Strong system design skills"
  ],
  "tags": ["Node.js", "TypeScript", "MongoDB", "Backend"]
}
```

### Response (201 Created)
```json
{
  "success": true,
  "message": "Job created successfully",
  "data": {
    "_id": "67b2222222222222222222222",
    "jobTitle": "Senior Backend Engineer",
    "companyName": "Tech Solutions Inc",
    "jobLocation": "San Francisco, CA",
    "jobType": "Full-Time",
    "experienceLevel": "Senior (5+ years)",
    "jobCategory": "Software Development",
    "jobDescription": "We are looking for an experienced backend engineer to join our team...",
    "applicationDeadline": "2026-02-28",
    "status": "Active",
    "employerId": "67b1111111111111111111111",
    "tags": ["Node.js", "TypeScript", "MongoDB", "Backend"],
    "createdAt": "2026-01-30T11:00:00.000Z",
    "updatedAt": "2026-01-30T11:00:00.000Z"
  }
}
```

---

## 2. Get All Jobs

**Endpoint**: `GET /api/jobs`

**Authentication**: No

**Description**: Retrieve all active job postings

### Query Parameters (Optional)
- `limit`: Number of results (default: 10)
- `page`: Page number (default: 1)

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "_id": "67b2222222222222222222222",
      "jobTitle": "Senior Backend Engineer",
      "companyName": "Tech Solutions Inc",
      "jobLocation": "San Francisco, CA",
      "jobType": "Full-Time",
      "experienceLevel": "Senior (5+ years)",
      "jobCategory": "Software Development",
      "status": "Active",
      "employerId": "67b1111111111111111111111",
      "tags": ["Node.js", "TypeScript", "MongoDB", "Backend"],
      "createdAt": "2026-01-30T11:00:00.000Z"
    }
  ]
}
```

---

## 3. Search Jobs with Filters

**Endpoint**: `GET /api/jobs/search`

**Authentication**: No

**Description**: Search and filter jobs

### Query Parameters
- `keyword`: Search in job title or description
- `location`: Filter by job location
- `jobType`: Filter by job type (e.g., Full-Time, Part-Time, Contract)
- `experienceLevel`: Filter by experience level
- `category`: Filter by job category
- `salary_min`: Minimum salary (if applicable)
- `salary_max`: Maximum salary (if applicable)

### Example Request
```
GET /api/jobs/search?keyword=Backend&location=San%20Francisco&jobType=Full-Time
```

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "_id": "67b2222222222222222222222",
      "jobTitle": "Senior Backend Engineer",
      "companyName": "Tech Solutions Inc",
      "jobLocation": "San Francisco, CA",
      "jobType": "Full-Time",
      "experienceLevel": "Senior (5+ years)",
      "jobCategory": "Software Development",
      "status": "Active",
      "tags": ["Node.js", "TypeScript", "MongoDB", "Backend"],
      "createdAt": "2026-01-30T11:00:00.000Z"
    }
  ]
}
```

---

## 4. Get My Jobs (Employer)

**Endpoint**: `GET /api/jobs/employer/my-jobs`

**Authentication**: Required (Employer only)

**Description**: Get all jobs posted by the authenticated employer

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "_id": "67b2222222222222222222222",
      "jobTitle": "Senior Backend Engineer",
      "companyName": "Tech Solutions Inc",
      "jobLocation": "San Francisco, CA",
      "jobType": "Full-Time",
      "experienceLevel": "Senior (5+ years)",
      "jobCategory": "Software Development",
      "status": "Active",
      "employerId": "67b1111111111111111111111",
      "tags": ["Node.js", "TypeScript", "MongoDB", "Backend"],
      "createdAt": "2026-01-30T11:00:00.000Z"
    }
  ]
}
```

---

## 5. Get Job by ID

**Endpoint**: `GET /api/jobs/:id`

**Authentication**: No

**Description**: Retrieve a specific job posting with full details

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "67b2222222222222222222222",
    "jobTitle": "Senior Backend Engineer",
    "companyName": "Tech Solutions Inc",
    "jobLocation": "San Francisco, CA",
    "jobType": "Full-Time",
    "experienceLevel": "Senior (5+ years)",
    "jobCategory": "Software Development",
    "jobDescription": "We are looking for an experienced backend engineer to join our team...",
    "applicationDeadline": "2026-02-28",
    "responsibilities": [
      "Design and develop scalable backend systems",
      "Lead a team of junior engineers",
      "Mentor junior developers"
    ],
    "qualifications": [
      "5+ years of backend development experience",
      "Proficiency in Node.js and TypeScript",
      "Experience with MongoDB and databases",
      "Strong system design skills"
    ],
    "status": "Active",
    "employerId": "67b1111111111111111111111",
    "tags": ["Node.js", "TypeScript", "MongoDB", "Backend"],
    "createdAt": "2026-01-30T11:00:00.000Z",
    "updatedAt": "2026-01-30T11:00:00.000Z"
  }
}
```

---

## 6. Update Job

**Endpoint**: `PUT /api/jobs/:id`

**Authentication**: Required (Employer - must own the job)

**Description**: Update a job posting

### Request Body
```json
{
  "jobTitle": "Senior Backend Engineer (Updated)",
  "jobDescription": "Updated job description...",
  "applicationDeadline": "2026-03-15",
  "status": "Active",
  "responsibilities": [
    "Design and develop scalable backend systems",
    "Lead a team of engineers",
    "Mentor team members"
  ]
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Job updated successfully",
  "data": {
    "_id": "67b2222222222222222222222",
    "jobTitle": "Senior Backend Engineer (Updated)",
    "companyName": "Tech Solutions Inc",
    "jobLocation": "San Francisco, CA",
    "jobType": "Full-Time",
    "experienceLevel": "Senior (5+ years)",
    "jobCategory": "Software Development",
    "applicationDeadline": "2026-03-15",
    "status": "Active",
    "employerId": "67b1111111111111111111111",
    "tags": ["Node.js", "TypeScript", "MongoDB", "Backend"],
    "updatedAt": "2026-01-30T12:00:00.000Z"
  }
}
```

---

## 7. Delete Job

**Endpoint**: `DELETE /api/jobs/:id`

**Authentication**: Required (Employer - must own the job)

**Description**: Delete a job posting

### Response (200 OK)
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

---

# Response Format

## Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ },
  "token": "JWT token (if applicable)"
}
```

## Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

# Error Handling

## Common HTTP Status Codes

| Status Code | Description |
|---|---|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Not authorized to access resource |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

## Error Examples

### Email Already Exists
```json
{
  "success": false,
  "message": "Email already in use"
}
```

### Invalid Credentials
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Unauthorized Access
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### Validation Error
```json
{
  "success": false,
  "message": "field1: error message, field2: error message"
}
```

---

## Environment Setup

### Required Environment Variables (.env)

```env
PORT=5000
MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net/jobmitra
JWT_SECRET=your_secret_key_here
MAX_FILE_UPLOAD=5000000
```

---

## Development

### Run Server
```bash
npm run dev
```

### Build Project
```bash
npm run build
```

### Start Production
```bash
npm start
```

---

## Additional Notes

1. **Authentication**: All protected routes check the JWT token in the Authorization header
2. **Password Hashing**: Passwords are hashed using bcryptjs with salt rounds of 10
3. **Data Filtering**: Sensitive data (passwords, etc.) is filtered before sending responses
4. **File Uploads**: Profile photos use multer middleware for file handling
5. **CORS**: Enabled for all origins
6. **Timestamps**: All resources have createdAt and updatedAt timestamps

---

**Last Updated**: January 30, 2026
