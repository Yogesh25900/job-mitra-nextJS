# JobMitra Frontend (Next.js)

JobMitra frontend is a multi-role web app for a job portal platform with dedicated experiences for Talent (candidates), Employer (recruiters), and Admin users.

## Features

### Public + Shared
- Public landing pages (home, about, contact)
- Job discovery flow with listings, filters, and job details
- Multi-step application UI flow
- Shared app header/sidebar/profile and theme toggle
- Feedback and AI chat entry points

### Talent (Candidate)
- Talent dashboard-style section
- Saved jobs and application management views
- Notifications, recommendations, profile, and settings pages

### Employer (Recruiter)
- Employer workspace layout and dashboard cards
- Multi-step job posting wizard
- My jobs, applicants, candidate, interview, and profile/settings pages

### Admin
- Admin login and protected admin area
- User management (create/edit)
- Job management (create/edit/view)
- Feedback, profile, and settings pages

## Tech Stack
- Next.js (App Router) + TypeScript
- React 19
- Tailwind CSS
- Axios for API calls
- Jest + Testing Library (unit/integration)
- Cypress (E2E)

## Prerequisites
- Node.js 18+
- npm (or pnpm/yarn/bun)

## Installation

1. Install dependencies

```bash
npm install
```

2. Create local env file

```bash
cp .env.example .env.local
```

3. Start development server

```bash
npm run dev
```

4. Open app

http://localhost:3000

## Environment Variables

Defined in `.env.example`:

- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` : Google OAuth client ID
- `NEXT_PUBLIC_BACKEND_URL` : Backend base URL for attachments and API-connected frontend flows

Example:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

## Available Scripts

- `npm run dev` : Start development server
- `npm run build` : Build production bundle
- `npm run start` : Run production server
- `npm run lint` : Run ESLint
- `npm run test` : Run Jest tests
- `npm run test:watch` : Run Jest in watch mode
- `npm run e2e` : Run Cypress in headless mode
- `npm run e2e:open` : Open Cypress UI runner

## Project Structure

- `app/` : App Router routes grouped by role/section (`(auth)`, `(public)`, `admin`, `api`)
- `components/` : Shared UI components and global modals
- `context/` : App-level React context (auth)
- `lib/actions/` : Server/client action wrappers by domain
- `lib/api/` : API client modules and endpoint maps
- `lib/utils/` : Utility helpers
- `public/` : Static icons and logo assets
- `cypress/` : End-to-end tests

## Testing

Run unit/integration tests:

```bash
npm run test
```

Run E2E tests:

```bash
npm run e2e
```

## Notes

- Backend service should be running and reachable through `NEXT_PUBLIC_BACKEND_URL`.
- If API/auth flows fail locally, verify `.env.local` values first.
