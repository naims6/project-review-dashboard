export type ProjectStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface StudentInfo {
  id: string;
  name: string;
  email: string;
}

export interface MentorInfo {
  id: string;
  name: string;
  email: string;
}

export interface MentorProjectItem {
  id: string;
  name: string;
  repoUrl: string;
  liveUrl: string;
  status: ProjectStatus;
  createdAt: string;
  student: StudentInfo;
}

export interface MentorProjectDetail {
  id: string;
  name: string;
  repoUrl: string;
  liveUrl: string;
  description: string;
  status: ProjectStatus;
  studentId: string;
  reviewedById: string | null;
  reviewedAt: string | null;
  reviewComment: string | null;
  createdAt: string;
  updatedAt: string;
  student: StudentInfo;
  reviewedBy?: MentorInfo | null;
}

export interface MentorStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface ReviewProjectPayload {
  status: "APPROVED" | "REJECTED";
  reviewComment?: string;
}

export interface MentorProjectsQuery {
  page?: number;
  limit?: number;
  status?: ProjectStatus | "ALL";
  search?: string;
  sortOrder?: "asc" | "desc";
}
