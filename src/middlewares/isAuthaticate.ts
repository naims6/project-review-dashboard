import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import { IJwtPayload } from "../types/index.js";
import config from "../config/env.js";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookieToken = req.cookies.accessToken;
    const headerToken = req.headers.authorization?.split(" ")[1];

    const token = headerToken || cookieToken;
    console.log("token:", token);
    if (!token) {
      throw new AppError(401, "Unauthorized Access");
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as IJwtPayload;

    console.log("decoded:", decoded);

    if (!decoded) {
      throw new AppError(401, "Unauthorized");
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch {
    throw new AppError(401, "Unauthorized Access");
  }
};

export default isAuthenticated;
