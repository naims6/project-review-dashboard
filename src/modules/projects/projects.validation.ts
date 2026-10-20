import { z } from "zod";

const createProjectValidationSchema = z.object({
  name: z
    .string({
      error: "Project name must be a valid string",
    })
    .trim()
    .min(2, "Project name must be at least 2 characters long"),
  repoUrl: z
    .string({
      error: "Repository URL must be a valid string",
    })
    .trim()
    .url("Repository URL must be a valid URL"),
  liveUrl: z
    .string({
      error: "Live URL must be a valid string",
    })
    .trim()
    .url("Live URL must be a valid URL"),
  description: z
    .string({
      error: "Description must be a valid string",
    })
    .trim()
    .min(5, "Description must be at least 5 characters long"),
});

export const ProjectValidation = {
  createProjectValidationSchema,
};
