"use server";

import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { PaginatedResponse } from "@/lib/api/types";
import type {
  CreateProjectPayload,
  MyProjectsQuery,
  StudentProjectDetail,
  StudentProjectItem,
} from "@/types/project";

/** POST /projects – Submit a new project for mentor review */
export async function submitProject(
  payload: CreateProjectPayload,
): Promise<StudentProjectItem> {
  return await api.post<StudentProjectItem, CreateProjectPayload>(
    endpoints.projects.submit,
    payload,
  );
}

/** GET /projects/me – Paginated list of the student's own submissions */
export async function getMyProjects(
  query: MyProjectsQuery = {},
): Promise<PaginatedResponse<StudentProjectItem>> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));

  const qs = params.toString();
  const url = qs ? `${endpoints.projects.myProjects}?${qs}` : endpoints.projects.myProjects;

  return await api.get<PaginatedResponse<StudentProjectItem>>(url, {
    tags: ["my-projects"],
    revalidate: 0,
  });
}

/** GET /projects/:id – Full detail of a single project (student view) */
export async function getProjectById(id: string): Promise<StudentProjectDetail> {
  return await api.get<StudentProjectDetail>(endpoints.projects.detail(id), {
    tags: [`project-${id}`],
    revalidate: 0,
  });
}
