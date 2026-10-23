import { z } from "zod";

// ── Submit Project ─────────────────────────────────────────────────────────────

export const submitProjectSchema = z.object({
  name: z.string().trim().min(2, "Project name must be at least 2 characters"),
  repoUrl: z
    .url("Must be a valid URL")
    .refine(
      (url) => /^https?:\/\/(www\.)?github\.com\/.+/.test(url),
      "Must be a valid GitHub repository URL",
    ),
  liveUrl: z.string().trim().url("Must be a valid URL"),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters"),
});

export type SubmitProjectForm = z.infer<typeof submitProjectSchema>;

// ── Review Project ─────────────────────────────────────────────────────────────

export const reviewProjectSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"], {
    error: "Please select either APPROVED or REJECTED",
  }),
  reviewComment: z
    .string()
    .max(500, "Review comment cannot exceed 500 characters")
    .optional(),
});

export type ReviewProjectForm = z.infer<typeof reviewProjectSchema>;
