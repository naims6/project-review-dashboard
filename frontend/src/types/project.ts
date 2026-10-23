export type ProjectStatus = "PENDING" | "APPROVED" | "REJECTED";

/** A single row in the student's project list */
export interface StudentProjectItem {
  id: string;
  name: string;
  repoUrl: string;
  liveUrl: string;
  description: string;
  status: ProjectStatus;
  reviewComment: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

/** Full detail returned by GET /projects/:id (student view) */
export interface StudentProjectDetail {
  id: string;
  name: string;
  repoUrl: string;
  liveUrl: string;
  description: string;
  status: ProjectStatus;
  reviewComment: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Payload for creating / submitting a project */
export interface CreateProjectPayload {
  name: string;
  repoUrl: string;
  liveUrl: string;
  description: string;
}

/** Query options for getMyProjects */
export interface MyProjectsQuery {
  page?: number;
  limit?: number;
}
