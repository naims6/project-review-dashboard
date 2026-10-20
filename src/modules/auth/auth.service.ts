import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { db } from "../../../prisma/db.js";
import config from "../../config/env.js";
import AppError from "../../utils/AppError.js";
import { ILoginUserPayload, ISignupStudentPayload } from "./auth.validation.js";

const signupStudent = async (payload: ISignupStudentPayload) => {
  // 1. Check if user already exists
  const existingUser = await db.orm.public.User.where({
    email: payload.email,
  }).first();

  if (existingUser) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "User with this email already exists",
    );
  }

  // 2. Hash password
  const hashedPassword = await bcryptjs.hash(
    payload.password,
    config.bcrypt_salt_rounds,
  );

  // 3. Register student
  const student = await db.orm.public.User.select(
    "id",
    "name",
    "email",
    "role",
    "createdAt",
    "updatedAt",
  ).create({
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
    role: "STUDENT",
  });

  return student;
};

const loginUser = async (payload: ILoginUserPayload) => {
  // 1. Check if user exists
  const user = await db.orm.public.User.where({ email: payload.email }).first();

  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }

  // 2. Verify password
  const isPasswordMatched = await bcryptjs.compare(
    payload.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }

  // 3. Generate JWT access token
  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret, {
    expiresIn: config.jwt_access_expires_in,
  } as jwt.SignOptions);

  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  };
};

export const AuthService = {
  signupStudent,
  loginUser,
};
