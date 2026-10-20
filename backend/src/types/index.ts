export interface ErrorResponse {
  success: boolean;
  message: string;
  stack?: string;
  error?: string;
}

export type UserRole = "STUDENT" | "MENTOR" | "ADMIN";

export interface IJwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}
