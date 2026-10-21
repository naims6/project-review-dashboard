import { z } from "zod";

const signupValidationSchema = z.object({
  name: z
    .string({
      error: "Name must be a valid string",
    })
    .min(2, "Name must be at least 2 characters long"),
  email: z.email("Invalid email address"),
  password: z
    .string({
      error: "Password must be a valid string",
    })
    .min(6, "Password must be at least 6 characters long"),
});

const loginValidationSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string({
      error: "Password must be a valid string",
    })
    .min(1, "Password is required"),
});

const refreshTokenValidationSchema = z.object({
  refreshToken: z
    .string({
      error: "Refresh token must be a valid string",
    })
    .optional(),
});

type ISignupStudentPayload = z.infer<typeof signupValidationSchema>;
type ILoginUserPayload = z.infer<typeof loginValidationSchema>;
type IRefreshTokenPayload = z.infer<typeof refreshTokenValidationSchema>;

export type { ISignupStudentPayload, ILoginUserPayload, IRefreshTokenPayload };
export const AuthValidation = {
  signupValidationSchema,
  loginValidationSchema,
  refreshTokenValidationSchema,
};
