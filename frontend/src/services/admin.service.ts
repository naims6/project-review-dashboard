"use server";

import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { PaginatedResponse } from "@/lib/api/types";
import type {
  AdminUserItem,
  AdminUsersQuery,
  CreateAdminUserPayload,
} from "@/types/admin";

/** GET /admin/users - Get paginated users with role filter, search, and sorting */
export async function getAdminUsers(
  query: AdminUsersQuery = {},
): Promise<PaginatedResponse<AdminUserItem>> {
  const params = new URLSearchParams();

  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.role && query.role !== "ALL") params.set("role", query.role);
  if (query.search?.trim()) params.set("search", query.search.trim());
  if (query.sortBy) params.set("sortBy", query.sortBy);
  if (query.sortOrder) params.set("sortOrder", query.sortOrder);

  const queryString = params.toString();
  const url = queryString
    ? `${endpoints.admin.users}?${queryString}`
    : endpoints.admin.users;

  return await api.get<PaginatedResponse<AdminUserItem>>(url, {
    tags: ["admin-users"],
    revalidate: 0,
  });
}

/** POST /admin/users - Create new student or mentor */
export async function createAdminUser(
  payload: CreateAdminUserPayload,
): Promise<AdminUserItem> {
  return await api.post<AdminUserItem, CreateAdminUserPayload>(
    endpoints.admin.createUser,
    payload,
  );
}
