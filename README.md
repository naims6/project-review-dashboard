# Project Submission and Review Dashboard

A full-stack project submission and review platform built with TypeScript, Express.js, Prisma ORM, and PostgreSQL. Designed for educational institutions and bootcamps to streamline student project submissions and mentor reviews.

---

## 🛠️ Tech Stack

- **Language:** TypeScript
- **Backend:** Express.js (v5)
- **Database:** PostgreSQL via Prisma ORM (v8)
- **Authentication:** JWT with Role-Based Access Control (`STUDENT`, `MENTOR`, `ADMIN`)
- **Validation:** Zod
- **Documentation:** OpenAPI 3.0 / Swagger UI (`/api-docs`)
- **Security:** HTTP-only cookies, CORS with credentials, express-rate-limit

---

## 🔑 Demo & Test Credentials

After running the database seed script (`pnpm run seed`), the following accounts are ready to use:

| Role | Email | Password | Allowed Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@demo.com` | `password123` | Full administrative oversight & review capabilities |
| **Mentor** | `mentor@demo.com` | `password123` | View submissions, filter by status, review/approve/reject |
| **Student** | `student@demo.com` | `password123` | Submit projects, view own submission history |

> **Note:** Students can also self-register via the signup endpoint `POST /api/v1/auth/signup`.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v20+ recommended)
- pnpm (v9+ or v12)
- PostgreSQL database instance

### 2. Backend Setup

```bash
cd backend

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env
# Edit .env and supply your DATABASE_URL and JWT_ACCESS_SECRET

# Push database schema & generate contracts
pnpm run contract:emit

# Seed test accounts (Admin, Mentor, Student)
pnpm run seed

# Run in development mode
pnpm run dev
```

The backend server runs at `http://localhost:5000`.

### 3. API Documentation
Once the server is running, visit:
- **Swagger Documentation:** `http://localhost:5000/api-docs`
- **Health Check:** `http://localhost:5000/`

---

## 📡 API Endpoints Overview

### Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/signup` - Register a new student account (Rate-limited: 5 attempts / 15m)
- `POST /api/v1/auth/login` - Authenticate and receive HTTP-only cookie + JWT token (Rate-limited: 5 attempts / 15m)
- `GET /api/v1/auth/me` - Retrieve current authenticated profile
- `POST /api/v1/auth/logout` - Clear session cookie

### Student Project Submissions (`/api/v1/projects`)
- `POST /api/v1/projects` - Submit project details (`name`, `repoUrl`, `liveUrl`, `description`).
  - *Protected:* Requires `STUDENT` role.
  - *Duplicate Prevention:* Validates that `repoUrl` has not already been submitted.
  - *Rate Limiter:* User-keyed rate limiting (5 submissions per hour per user).
- `GET /api/v1/projects/me` - Retrieve list of projects submitted by the logged-in student.

### Mentor Review Dashboard (`/api/v1/mentor`)
- `GET /api/v1/mentor/projects?page=1&limit=10&status=PENDING` - Server-side paginated projects with optional status filter (`PENDING`, `APPROVED`, `REJECTED`).
- `GET /api/v1/mentor/projects/:id` - Detailed project view with student info.
- `PATCH /api/v1/mentor/projects/:id/review` - Approve or reject project with optional/required feedback comments.
- `GET /api/v1/mentor/stats` - Aggregated counts: total, pending, approved, and rejected.

---

## 💡 Architecture & Key Decisions

1. **User-Keyed Rate Limiting:**
   On authenticated endpoints (such as project submissions), rate limiting runs *after* authentication and uses the authenticated user ID (`req.user.id`) rather than raw client IP. This prevents students on shared NAT or institutional Wi-Fi from blocking each other.

2. **Cross-Domain Cookie Security:**
   Session cookies use `sameSite: "none"` with `secure: true` in production environments to support separated frontend (e.g., Vercel) and backend (e.g., Render/Railway) deployments, while falling back to `sameSite: "lax"` in local development. Authorization Bearer tokens are also fully accepted via request headers.

3. **Strict Validation & Duplicate Prevention:**
   All payloads are validated against Zod schemas before touching service layers. Unique constraints are enforced at both the database schema level and business logic level.
