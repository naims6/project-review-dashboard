const BASE = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"}/api/v1`;

export const endpoints = {
  auth: {
    signup:       `${BASE}/auth/signup`,
    login:        `${BASE}/auth/login`,
    logout:       `${BASE}/auth/logout`,
    me:           `${BASE}/auth/me`,
    refreshToken: `${BASE}/auth/refresh-token`,
  },

  users: {
    list:   `${BASE}/users`,
    detail: (id: string) => `${BASE}/users/${id}`,
    create: `${BASE}/users`,
    update: (id: string) => `${BASE}/users/${id}`,
    delete: (id: string) => `${BASE}/users/${id}`,
  },

  // Add more resources here following the same pattern
} as const;
