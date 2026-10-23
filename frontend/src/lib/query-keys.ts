import type { MentorProjectsQuery } from "@/types/mentor";
import type { MyProjectsQuery } from "@/types/project";
import type { AdminUsersQuery } from "@/types/admin";

export const queryKeys = {
  // Mentor
  mentorStats: ["mentor", "stats"] as const,
  mentorProjects: (params: MentorProjectsQuery) =>
    ["mentor", "projects", params] as const,
  mentorProjectDetail: (id: string) => ["mentor", "projects", id] as const,

  // Student
  myProjects: (params: MyProjectsQuery) =>
    ["projects", "my", params] as const,

  // Admin
  adminUsers: (params: AdminUsersQuery) =>
    ["admin", "users", params] as const,

  // Auth
  me: ["auth", "me"] as const,
} as const;
