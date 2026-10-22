"use server";

import { cookies } from "next/headers";
import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type {
  LoginPayload,
  LoginResponse,
  RefreshTokenResponse,
  SignupPayload,
  User,
} from "@/types/auth";

/** POST /auth/signup - Register new student and automatically log them in */
export async function signup(payload: SignupPayload): Promise<LoginResponse> {
  await api.post<User, SignupPayload>(endpoints.auth.signup, payload);
  return await login({
    email: payload.email,
    password: payload.password,
  });
}

/** POST /auth/login - Logs in user and sets HTTP-only cookies in Next.js store */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const result = await api.post<LoginResponse, LoginPayload>(
    endpoints.auth.login,
    payload,
  );

  const cookieStore = await cookies();

  if (result.accessToken) {
    cookieStore.set("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60, // 15 mins
    });
  }

  if (result.refreshToken) {
    cookieStore.set("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
  }

  return result;
}

/** POST /auth/refresh-token - Rotates access token */
export async function refreshToken(): Promise<RefreshTokenResponse> {
  const result = await api.post<RefreshTokenResponse, Record<string, never>>(
    endpoints.auth.refreshToken,
    {},
  );

  if (result.accessToken) {
    const cookieStore = await cookies();
    cookieStore.set("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });
  }

  return result;
}

/** GET /auth/me - Returns current authenticated user */
export async function getMe(): Promise<User> {
  return await api.get<User>(endpoints.auth.me);
}

/** POST /auth/logout - Logs out user and deletes cookies */
export async function logout(): Promise<null> {
  try {
    return await api.post<null, Record<string, never>>(endpoints.auth.logout, {});
  } finally {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
  }
}
