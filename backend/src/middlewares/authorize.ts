import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/AppError.js";
import { UserRole } from "../types/index.js";

const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(
        new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized Access"),
      );
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return next(
        new AppError(
          StatusCodes.FORBIDDEN,
          "You are not authorized to perform this action",
        ),
      );
    }

    next();
  };
};

export default authorize;
