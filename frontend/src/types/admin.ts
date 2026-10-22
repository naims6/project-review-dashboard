import { Role } from "./auth";

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminUserPayload {
  name: string;
  email: string;
  password: string;
  role: "STUDENT" | "MENTOR";
}

export interface AdminUsersQuery {
  page?: number;
  limit?: number;
  role?: Role | "ALL";
  search?: string;
  sortBy?: "createdAt" | "name" | "email" | "role";
  sortOrder?: "asc" | "desc";
}
