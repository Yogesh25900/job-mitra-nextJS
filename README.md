JobMitra is a Next.js app for job seekers and employers. It includes public browsing, authentication flows, and UI helpers for consistent styling.

## Tech stack
- Next.js (App Router) + TypeScript
- Tailwind CSS + PostCSS
- Shadcn UI components
- ESLint + TypeScript strictness

## Requirements
- Node.js 18+
- pnpm (preferred) or npm/yarn/bun

## Installation
1) Install dependencies
```bash
pnpm install
# or
npm install
# or
yarn install
# or
bun install
```
2) Create environment file
```bash
cp .env.example .env.local
# then fill required keys
```
3) Start the dev server
```bash
pnpm dev
```
4) Open http://localhost:3000

## Useful scripts
- `pnpm dev` starts the Next.js dev server.
- `pnpm lint` runs lint checks.
- `pnpm build` creates an optimized production build.
- `pnpm start` serves the production build.

## Project structure
- `app/` application routes (auth pages in `app/(auth)/`, public pages in `app/(public)/`).
- `components/` shared components including UI primitives.
- `hooks/` reusable hooks.
- `lib/` utilities.
- `public/` static assets.

## Conventions
- Keep UI pieces in `components/` and colocate small route-specific components under their route folders.
- Prefer TypeScript and strict typing for forms and API helpers.
- Run `pnpm lint` before opening a PR to maintain consistency.
