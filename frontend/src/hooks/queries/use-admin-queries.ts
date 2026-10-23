"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminUsers, createAdminUser } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import type { AdminUsersQuery, CreateAdminUserPayload } from "@/types/admin";

// ── Queries ──

export function useAdminUsers(query: AdminUsersQuery) {
  return useQuery({
    queryKey: queryKeys.adminUsers(query),
    queryFn: () => getAdminUsers(query),
    placeholderData: (prev) => prev,
  });
}

// ── Mutations ──

export function useCreateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminUserPayload) => createAdminUser(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}
