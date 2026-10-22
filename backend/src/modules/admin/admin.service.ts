import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { or } from "@prisma/orm-postgres/orm-client";
import { db } from "../../prisma/db.js";
import config from "../../config/env.js";
import AppError from "../../utils/AppError.js";
import {
  calculatePagination,
  buildPaginationMeta,
} from "../../utils/pagination.js";
import { UserRole } from "../../types/index.js";
import {
  ICreateUserPayload,
  IGetUsersQuery,
  UserSortField,
} from "./admin.validation.js";

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

const getAllUsers = async (query: IGetUsersQuery = {}) => {
  const { page, limit, offset, sortBy, sortOrder } = calculatePagination(query);

  let collection = db.orm.public.User;

  // Filter by role (STUDENT, MENTOR, ADMIN)
  if (query.role) {
    const normalizedRole = query.role.toUpperCase();
    if (["STUDENT", "MENTOR", "ADMIN"].includes(normalizedRole)) {
      collection = collection.where((u) =>
        u.role.eq(normalizedRole as UserRole),
      );
    }
  }

  // Search by name or email (case-insensitive substring)
  if (query.search?.trim()) {
    const searchTerm = `%${query.search.trim()}%`;
    collection = collection.where((u) =>
      or(u.name.ilike(searchTerm), u.email.ilike(searchTerm)),
    );
  }

  // Safe sorting
  const validSortFields: UserSortField[] = [
    "createdAt",
    "name",
    "email",
    "role",
  ];
  const sortField: UserSortField = validSortFields.includes(
    sortBy as UserSortField,
  )
    ? (sortBy as UserSortField)
    : "createdAt";
  const isAsc = sortOrder === "asc";

  const [countResult, users] = await Promise.all([
    collection.aggregate((agg) => ({ count: agg.count() })),
    collection
      .select("id", "name", "email", "role", "createdAt", "updatedAt")
      .orderBy((u) =>
        isAsc
          ? (u[sortField] as any).asc()
          : (u[sortField] as any).desc(),
      )
      .limit(limit)
      .offset(offset)
      .all(),
  ]);

  const total = countResult.count;

  return {
    meta: buildPaginationMeta(total, page, limit),
    data: users,
  };
};

export const AdminService = {
  createUser,
  getAllUsers,
};
