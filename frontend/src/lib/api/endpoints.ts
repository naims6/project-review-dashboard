const RAW_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const BASE = RAW_BASE.endsWith("/api/v1")
  ? RAW_BASE
  : `${RAW_BASE.replace(/\/$/, "")}/api/v1`;

export const endpoints = {
  auth: {
    signup: `${BASE}/auth/signup`,
    login: `${BASE}/auth/login`,
    logout: `${BASE}/auth/logout`,
    me: `${BASE}/auth/me`,
    refreshToken: `${BASE}/auth/refresh-token`,
  },

  mentor: {
    projects: `${BASE}/mentor/projects`,
    projectDetail: (id: string) => `${BASE}/mentor/projects/${id}`,
    reviewProject: (id: string) => `${BASE}/mentor/projects/${id}/review`,
    stats: `${BASE}/mentor/stats`,
  },

  admin: {
    users: `${BASE}/admin/users`,
    createUser: `${BASE}/admin/users`,
  },
  
  projects: {
    submit: `${BASE}/projects`,
    myProjects: `${BASE}/projects/me`,
    detail: (id: string) => `${BASE}/projects/${id}`,
  },
} as const;
