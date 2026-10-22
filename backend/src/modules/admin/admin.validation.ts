import { z } from "zod";

const createUserValidationSchema = z.object({
  name: z
    .string({
      error: "Name must be a valid string",
    })
    .trim()
    .min(2, "Name must be at least 2 characters long"),
  email: z.email("Invalid email address"),
  password: z
    .string({
      error: "Password must be a valid string",
    })
    .min(6, "Password must be at least 6 characters long"),
  role: z.enum(["STUDENT", "MENTOR"], {
    error: "Role must be either STUDENT or MENTOR",
  }),
});

type ICreateUserPayload = z.infer<typeof createUserValidationSchema>;

export type { ICreateUserPayload };
export const AdminValidation = {
  createUserValidationSchema,
};
