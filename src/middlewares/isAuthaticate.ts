import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import { IJwtPayload } from "../types/index.js";
import config from "../config/env.js";

const isAuthenticated = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const cookieToken = req.cookies.accessToken;
    const headerToken = req.headers.authorization?.split(" ")[1];

    const token = headerToken || cookieToken;

    if (!token) {
      return next(new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized Access"));
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as IJwtPayload;

    if (!decoded) {
      return next(new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized Access"));
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch {
    next(new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized Access"));
  }
};

export default isAuthenticated;
