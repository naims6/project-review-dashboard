"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyProjects, submitProject, getProjectById } from "@/services/project.service";
import { queryKeys } from "@/lib/query-keys";
import type { CreateProjectPayload, MyProjectsQuery } from "@/types/project";

// ── Queries ──

export function useMyProjects(query: MyProjectsQuery) {
  return useQuery({
    queryKey: queryKeys.myProjects(query),
    queryFn: () => getMyProjects(query),
    placeholderData: (prev) => prev,
  });
}

export function useProjectDetail(id: string | null) {
  return useQuery({
    queryKey: ["projects", "detail", id],
    queryFn: () => getProjectById(id!),
    enabled: !!id,
  });
}

// ── Mutations ──

export function useSubmitProject() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => submitProject(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects", "my"] });
    },
  });
}
