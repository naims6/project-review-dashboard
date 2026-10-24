import { cookies } from "next/headers";
import { endpoints } from "./endpoints";
import { ApiError } from "./types";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface RequestOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  tags?: string[];
  revalidate?: number | false;
  headers?: Record<string, string>;
}

type GetOptions = Omit<RequestOptions, "method" | "body">;
type MutateOptions<TBody> = Omit<RequestOptions<TBody>, "method" | "body">;

// ---------------------------------------------------------------------------

async function getTokens() {
  const store = await cookies();
  return {
    accessToken: store.get("accessToken")?.value,
    refreshToken: store.get("refreshToken")?.value,
  };
}

async function setAccessToken(token: string) {
  const store = await cookies();
  store.set("accessToken", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60, 
  });
}

async function tryRefreshToken(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch(endpoints.auth.refreshToken, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const newToken: string = json.data?.accessToken ?? json.accessToken;
    if (newToken) await setAccessToken(newToken);
    return newToken;
  } catch {
    return null;
  }
}

async function buildHeaders(extra?: Record<string, string>) {
  const { accessToken } = await getTokens();
  return {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...extra,
  };
}

async function parseError(res: Response): Promise<ApiError> {
  let body: { message?: string; errors?: Record<string, string[]> } = {};
  try {
    body = await res.json();
  } catch {}
  return new ApiError(
    res.status,
    body.message ?? `${res.status} ${res.statusText}`,
    body.errors,
  );
}

// ---------------------------------------------------------------------------

async function request<TResponse, TBody = unknown>(
  url: string,
  options: RequestOptions<TBody> = {},
): Promise<TResponse> {
  const { method = "GET", body, tags, revalidate, headers: extra } = options;

  const doFetch = (headers: Record<string, string>) =>
    fetch(url, {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
      ...(tags || revalidate !== undefined
        ? { next: { ...(tags ? { tags } : {}), ...(revalidate !== undefined ? { revalidate } : {}) } }
        : { cache: "no-store" }),
    });

  let res = await doFetch(await buildHeaders(extra));

  // 401/403 → refresh token and retry once
  if (res.status === 401 || res.status === 403) {
    const { refreshToken } = await getTokens();
    if (refreshToken) {
      const newToken = await tryRefreshToken(refreshToken);
      if (newToken) {
        res = await doFetch({
          "Content-Type": "application/json",
          Authorization: `Bearer ${newToken}`,
          ...extra,
        });
      }
    }
  }

  if (!res.ok) throw await parseError(res);
  if (res.status === 204) return undefined as TResponse;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const json: any = await res.json();
  if (json && typeof json === "object" && "meta" in json && "data" in json) {
    return { data: json.data, meta: json.meta } as TResponse;
  }
  return json.data ?? (json as TResponse);
}

// The public API — use `api.get`, `api.post`, etc. in all services

export const api = {
  get: <TResponse>(url: string, options?: GetOptions) =>
    request<TResponse>(url, { ...options, method: "GET" }),

  post: <TResponse, TBody = unknown>(
    url: string,
    body: TBody,
    options?: MutateOptions<TBody>,
  ) => request<TResponse, TBody>(url, { ...options, method: "POST", body }),

  patch: <TResponse, TBody = unknown>(
    url: string,
    body: TBody,
    options?: MutateOptions<TBody>,
  ) => request<TResponse, TBody>(url, { ...options, method: "PATCH", body }),

  put: <TResponse, TBody = unknown>(
    url: string,
    body: TBody,
    options?: MutateOptions<TBody>,
  ) => request<TResponse, TBody>(url, { ...options, method: "PUT", body }),

  delete: <TResponse>(url: string, options?: GetOptions) =>
    request<TResponse>(url, { ...options, method: "DELETE" }),
};
