# AGENTS.md — Project Submission & Review Dashboard (Frontend)

## Project Overview

A project submission and review dashboard built with **Next.js 16**, **TailwindCSS v4**, and **TypeScript**. Students can submit their projects; mentors can review, approve, or reject them.


---

## Tech Stack

| Tool             | Version  | Purpose                          |
|------------------|----------|----------------------------------|
| Next.js          | 16.4.2   | App Router, SSR/SSG              |
| React            | 19.3.0   | UI rendering                     |
| TypeScript       | ^5       | Type safety                      |
| TailwindCSS      | ^4       | Utility-first styling            |
| ShadCN/UI        | latest   | Accessible UI components         |
| zod              | latest   | Schema declaration & validation  |
| react-hook-form  | latest   | Form state & submission handling |
| @hookform/resolvers | latest | Connects zod schemas to RHF  |

---

## Project Structure

```
frontend/
├── src/
│   └── app/
│       ├── layout.tsx          # Root layout
│       ├── page.tsx            # Landing / redirect
│       ├── (auth)/
│       │   ├── login/          # Login page
│       │   └── signup/         # Student signup page
│       ├── student/
│       │   └── submit/         # Project submission form
│       └── mentor/
│           └── dashboard/      # Mentor review dashboard
├── components/                 # Shared UI components (ShadCN + custom)
├── lib/                        # API client, helpers, auth utils
└── types/                      # Shared TypeScript types
```

---

## Key Features to Build

### 1. Authentication Pages
- **Login**: email + password → calls `POST /api/v1/auth/login` → stores JWT in `httpOnly`
- **Signup**: name + email + password → calls `POST /api/v1/auth/signup` (students only; admins are seeded)
- Redirect authenticated users away from auth pages

### 2. Student — Submission Portal
- Form fields: **Project Name**, **Repo URL**, **Live Link**, **Description**
- Client-side validation (required fields, URL format) using `zod` + `react-hook-form`
- Prevent duplicate submission — disable/hide form if the student already has a submitted project
- Show clear success / error feedback after submission

### 3. Mentor — Review Dashboard
- **Paginated data table** of all project submissions (10 per page)
- **Approve / Reject** actions per row with an optional comment field
- **Status filter**: All | Pending | Approved | Rejected — filter applied server-side via query param
- **Stats bar** at the top: Total Pending · Total Approved · Total Rejected

---

## API Integration

| Method | Endpoint                        | Who   | Description                       |
|--------|---------------------------------|-------|-----------------------------------|
| POST   | `/auth/signup`                  | Any   | Register a new student            |
| POST   | `/auth/login`                   | Any   | Login; returns JWT                |
| POST   | `/projects`                     | Student | Submit a project                |
| GET    | `/mentor/projects`              | Mentor | Paginated list with filters      |
| PATCH  | `/mentor/projects/:id/review`   | Mentor | Approve or reject a project      |
| GET    | `/mentor/stats`                 | Mentor | Aggregated counts                 |

Send `Authorization: Bearer <token>` on all protected routes.

---

## Auth
- JWT is stored cookie
- Use Next.js proxy (`proxy.ts`) for route protection proxy is latest so never use middleware.ts

---

## Coding Conventions

- **File naming**: `kebab-case` for files, `PascalCase` for React components
- **Imports**: absolute paths using `@/` alias (configured in `tsconfig.json`)
- **Styling**: Tailwind utility classes only — no inline `style={}` props
- **Components**: prefer ShadCN primitives (`Button`, `Input`, `Table`, `Badge`, etc.)
- **Error handling**: always display user-facing error messages from API responses
- **TypeScript**: no `any` — define proper types in `src/types/`
- **Forms**: **every form MUST use `zod` + `react-hook-form`** — no exceptions (see Form Validation section below)

---

## Form Validation ⚠️ Strict Rule

> **Every single form in this project must be built with `react-hook-form` and validated with a `zod` schema. Direct `useState` form handling or manual validation is NOT allowed.**

### Schemas to implement

| Form              | Fields & rules                                                                                         |
|-------------------|--------------------------------------------------------------------------------------------------------|
| **Login**         | `email` — valid email; `password` — min 6 chars                                                       |
| **Signup**        | `name` — min 2 chars; `email` — valid email; `password` — min 6 chars                                 |
| **Submit Project**| `name` — min 3 chars; `repoUrl` — valid URL; `liveUrl` — valid URL; `description` — min 20 chars     |
| **Review action** | `status` — enum `APPROVED \| REJECTED`; `reviewComment` — optional string, max 500 chars              |

---

## Environment Variables

Create a `.env.local` file in `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

## Running Locally

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
```
