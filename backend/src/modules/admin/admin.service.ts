import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { db } from "../../prisma/db.js";
import config from "../../config/env.js";
import AppError from "../../utils/AppError.js";
import { ICreateUserPayload } from "./admin.validation.js";

const createUser = async (payload: ICreateUserPayload) => {
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

  // 3. Create user
  const user = await db.orm.public.User.select(
    "id",
    "name",
    "email",
    "role",
    "createdAt",
    "updatedAt",
  ).create({
    name: payload.name.trim(),
    email: payload.email.trim(),
    password: hashedPassword,
    role: payload.role,
  });

  return user;
};

export const AdminService = {
  createUser,
};
