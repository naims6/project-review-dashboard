# Project Submission & Review Dashboard

A full-stack web application for managing student project submissions and mentor reviews. Built with TypeScript, Next.js, Express.js, PostgreSQL, and Prisma ORM with JWT-based Role-Based Access Control (RBAC).

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)

## Overview

The Project Submission & Review Dashboard enables students to submit their projects for review and allows mentors/admins to evaluate, approve, or reject submissions through a centralized dashboard. The system includes rate limiting, robust validation, role-based access control, and comprehensive filtering capabilities.

## Features

### For Students
- **Project Submission** - Submit project details including project name, repository URL, live demo URL, and description
- **Submission Management** - View all personal submissions with status tracking (Pending, Approved, Rejected)
- **Project Details** - Access detailed view of individual submissions including mentor feedback
- **Robust Validation** - Prevents invalid submissions and duplicate entries
- **Rate Limiting** - Maximum 10 submissions per 15 minutes to prevent spam

### For Mentors & Admins
- **Review Dashboard** - Paginated table view of all project submissions
- **Project Review** - Approve or reject submissions with optional review comments
- **Advanced Filtering** - Server-side filtering by status (Approved/Rejected/Pending), search by project name
- **Sorting** - Sort submissions by date with ascending/descending order
- **Aggregated Statistics** - Real-time stats showing total, pending, approved, and rejected counts
- **Student Details** - View submitter information alongside project details

### Authentication & User Management
- **JWT Authentication** - Secure token-based authentication with access and refresh tokens
- **Role-Based Access Control** - Three roles: Student, Mentor, and Admin
- **Student Registration** - Self-registration for students via signup
- **Admin Management** - Admin can create and manage users (students and mentors)
- **Session Management** - HTTP-only cookies for secure token storage
- **Password Security** - Secure password handling with validation

## Tech Stack

| Layer | Technology |
|---|---|
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Frontend** | [Next.js](https://nextjs.org/), [TailwindCSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/) |
| **Backend** | [Express.js](https://expressjs.com/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **ORM** | [Prisma ORM](https://www.prisma.io/) |
| **Authentication** | JWT (JSON Web Tokens) with HTTP-only cookies |
| **Validation** | Server-side validation for all inputs |


### Key API Features

- **RESTful Design** - Consistent API structure with standardized response format
- **Pagination** - All list endpoints support pagination with metadata
- **Server-Side Filtering** - Filters and search performed on the server
- **Role-Based Authorization** - Route protection based on user roles
- **Rate Limiting** - Applied to submission endpoints
- **Secure Cookies** - HTTP-only cookies for token management

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) database
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PH
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env` files in both `backend/` and `frontend/` directories. See [Environment Variables](#environment-variables) section.

4. **Set up the database**
   ```bash
   cd backend
   
   # Run Prisma migrations
   npx prisma migrate dev
   
   # Seed admin user (as per requirements)
   npx prisma db seed
   ```

5. **Start the development servers**
   ```bash
   # Start backend server (from backend directory)
   npm run dev
   
   # Start frontend server (from frontend directory)
   npm run dev
   ```

The frontend will typically run on `http://localhost:3000` and the backend on `http://localhost:5000` (or your configured port).

## Environment Variables

### Backend (`backend/.env`)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/project_dashboard"

# JWT Configuration
JWT_ACCESS_SECRET="your-access-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL="http://localhost:3000"
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:5000/api/v1"
```

---

**Built with TypeScript, Next.js, Express.js, PostgreSQL, and Prisma ORM**
