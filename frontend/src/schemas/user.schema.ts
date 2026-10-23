import { z } from "zod";

// ── Create User (Admin) ──────────────────────────────────────────────────────

export const createUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long"),
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["STUDENT", "MENTOR"], {
    error: "Role must be either STUDENT or MENTOR",
  }),
});

export type CreateUserForm = z.infer<typeof createUserSchema>;
