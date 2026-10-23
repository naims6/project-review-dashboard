import { cache } from "react";
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


export const getMe = cache(async (): Promise<User> => {
  return await api.get<User>(endpoints.auth.me);
});


/** POST /auth/signup — registers a new student then logs them in */
export async function signup(payload: SignupPayload): Promise<LoginResponse> {
  "use server";
  await api.post<User, SignupPayload>(endpoints.auth.signup, payload);
  return await login({
    email: payload.email,
    password: payload.password,
  });
}

/** POST /auth/login — authenticates user and sets httpOnly cookies */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  "use server";
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

/** POST /auth/refresh-token — rotates the access token */
export async function refreshToken(): Promise<RefreshTokenResponse> {
  "use server";
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

/** POST /auth/logout — clears session cookies */
export async function logout(): Promise<null> {
  "use server";
  try {
    return await api.post<null, Record<string, never>>(endpoints.auth.logout, {});
  } finally {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
  }
}
