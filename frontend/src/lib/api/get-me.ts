import { cache } from "react";
import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { User } from "@/types/auth";

export const getMe = cache(async (): Promise<User> => {
  return await api.get<User>(endpoints.auth.me, { revalidate: 0 });
});
