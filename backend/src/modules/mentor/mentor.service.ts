import { StatusCodes } from "http-status-codes";
import { Temporal } from "temporal-polyfill";
import { db } from "../../../prisma/db.js";
import AppError from "../../utils/AppError.js";
import {
  calculatePagination,
  IPaginationMeta,
  IPaginationOptions,
} from "../../utils/pagination.js";

export type ProjectStatusType = "PENDING" | "APPROVED" | "REJECTED";

export interface IGetProjectsQuery extends IPaginationOptions {
  status?: ProjectStatusType;
  search?: string;
  sortOrder?: "asc" | "desc";
}

export interface IReviewProjectPayload {
  status: "APPROVED" | "REJECTED";
  reviewComment?: string;
}

const getProjects = async (query: IGetProjectsQuery) => {
  const { page, limit, offset } = calculatePagination(query);

  let collection = db.orm.public.Project;

  if (query.status) {
    const normalizedStatus = query.status.toUpperCase();
    if (["PENDING", "APPROVED", "REJECTED"].includes(normalizedStatus)) {
      collection = collection.where((p) =>
        p.status.eq(normalizedStatus as ProjectStatusType),
      );
    }
  }

  if (query.search?.trim()) {
    collection = collection.where((p) =>
      p.name.ilike(`%${query.search!.trim()}%`),
    );
  }

  const isAsc = query.sortOrder === "asc";

  const [countResult, projects] = await Promise.all([
    collection.aggregate((a) => ({ count: a.count() })),
    collection
      .include("student", (student) => student.select("id", "name", "email"))
      .orderBy((p) => (isAsc ? p.createdAt.asc() : p.createdAt.desc()))
      .limit(limit)
      .offset(offset)
      .all(),
  ]);

  const total = countResult.count;
  const totalPages = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
    data: projects,
  };
};

const getProjectById = async (id: string) => {
  const project = await db.orm.public.Project.where({ id })
    .include("student", (student) => student.select("id", "name", "email"))
    .first();

  if (!project) {
    throw new AppError(StatusCodes.NOT_FOUND, "Project not found");
  }

  return project;
};

const reviewProject = async (
  id: string,
  mentorId: string,
  payload: IReviewProjectPayload,
) => {
  const existingProject = await db.orm.public.Project.where({ id }).first();

  if (!existingProject) {
    throw new AppError(StatusCodes.NOT_FOUND, "Project not found");
  }

  const updatedProject = await db.orm.public.Project.where({ id }).update({
    status: payload.status,
    reviewComment: payload.reviewComment ?? null,
    reviewedById: mentorId,
    reviewedAt: Temporal.Now.instant(),
  });

  return updatedProject;
};

const getMentorStats = async () => {
  const stats = await db.orm.public.Project.groupBy("status").aggregate(
    (agg) => ({
      count: agg.count(),
    }),
  );

  let pending = 0;
  let approved = 0;
  let rejected = 0;
  let total = 0;

  for (const row of stats) {
    const count = row.count ?? 0;
    total += count;
    if (row.status === "PENDING") {
      pending = count;
    } else if (row.status === "APPROVED") {
      approved = count;
    } else if (row.status === "REJECTED") {
      rejected = count;
    }
  }

  return {
    total,
    pending,
    approved,
    rejected,
  };
};

export const MentorService = {
  getProjects,
  getProjectById,
  reviewProject,
  getMentorStats,
};
