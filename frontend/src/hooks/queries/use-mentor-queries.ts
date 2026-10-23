"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMentorProjects,
  getMentorProjectById,
  getMentorStats,
  reviewProject,
} from "@/services/mentor.service";
import { queryKeys } from "@/lib/query-keys";
import type { MentorProjectsQuery, ReviewProjectPayload } from "@/types/mentor";

// ── Queries ──

export function useMentorStats() {
  return useQuery({
    queryKey: queryKeys.mentorStats,
    queryFn: () => getMentorStats(),
  });
}

export function useMentorProjects(query: MentorProjectsQuery) {
  return useQuery({
    queryKey: queryKeys.mentorProjects(query),
    queryFn: () => getMentorProjects(query),
    placeholderData: (prev) => prev,
  });
}

export function useMentorProjectDetail(id: string | null) {
  return useQuery({
    queryKey: queryKeys.mentorProjectDetail(id ?? ""),
    queryFn: () => getMentorProjectById(id!),
    enabled: !!id,
  });
}

// ── Mutations ──

export function useReviewProject() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ReviewProjectPayload }) =>
      reviewProject(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mentor"] });
    },
  });
}
