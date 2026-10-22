import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { PaginatedResponse } from "@/lib/api/types";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: User["role"];
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: User["role"];
}

// ---------------------------------------------------------------------------

export const getUsers = (page = 1, limit = 10) =>
  api.get<PaginatedResponse<User>>(
    `${endpoints.users.list}?page=${page}&limit=${limit}`,
    { tags: ["users"] },
  );

export const getUserById = (id: string) =>
  api.get<User>(endpoints.users.detail(id), { tags: [`user-${id}`] });

export const createUser = (data: CreateUserDto) =>
  api.post<User, CreateUserDto>(endpoints.users.create, data);

export const updateUser = (id: string, data: UpdateUserDto) =>
  api.patch<User, UpdateUserDto>(endpoints.users.update(id), data);

export const deleteUser = (id: string) =>
  api.delete<void>(endpoints.users.delete(id));
