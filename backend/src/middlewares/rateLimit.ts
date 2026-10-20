import { rateLimit, Options } from "express-rate-limit";
import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError.js";
import { StatusCodes } from "http-status-codes";

// Factory

const createRateLimiter = (
  max: number,
  message: string,
  windowMs = 15 * 60 * 1000, // 15 minutes
) =>
  rateLimit({
    max,
    message,
    windowMs,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (
      _req: Request,
      _res: Response,
      next: NextFunction,
      options: Options,
    ) => next(new AppError(StatusCodes.TOO_MANY_REQUESTS, options.message)),
  });

// Limiters
export const globalLimiter = createRateLimiter(
  100,
  "Too many requests, please try again later.",
);

export const authLimiter = createRateLimiter(
  5,
  "Too many attempts, please try again later.",
);
