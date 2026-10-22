"use server";

import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { PaginatedResponse } from "@/lib/api/types";
import type {
  MentorProjectDetail,
  MentorProjectItem,
  MentorProjectsQuery,
  MentorStats,
  ReviewProjectPayload,
} from "@/types/mentor";

/** GET /mentor/stats - Get project statistics */
export async function getMentorStats(): Promise<MentorStats> {
  return await api.get<MentorStats>(endpoints.mentor.stats, {
    tags: ["mentor-stats"],
    revalidate: 0,
  });
}

/** GET /mentor/projects - Get paginated project submissions with filters */
export async function getMentorProjects(
  query: MentorProjectsQuery = {},
): Promise<PaginatedResponse<MentorProjectItem>> {
  const params = new URLSearchParams();

  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.status && query.status !== "ALL") params.set("status", query.status);
  if (query.search?.trim()) params.set("search", query.search.trim());
  if (query.sortOrder) params.set("sortOrder", query.sortOrder);

  const queryString = params.toString();
  const url = queryString
    ? `${endpoints.mentor.projects}?${queryString}`
    : endpoints.mentor.projects;

  return await api.get<PaginatedResponse<MentorProjectItem>>(url, {
    tags: ["mentor-projects"],
    revalidate: 0,
  });
}

/** GET /mentor/projects/:id - Get single project details */
export async function getMentorProjectById(
  id: string,
): Promise<MentorProjectDetail> {
  return await api.get<MentorProjectDetail>(endpoints.mentor.projectDetail(id), {
    tags: [`mentor-project-${id}`],
  });
}

/** PATCH /mentor/projects/:id/review - Approve or reject a project submission */
export async function reviewProject(
  id: string,
  payload: ReviewProjectPayload,
): Promise<MentorProjectDetail> {
  return await api.patch<MentorProjectDetail, ReviewProjectPayload>(
    endpoints.mentor.reviewProject(id),
    payload,
  );
}
