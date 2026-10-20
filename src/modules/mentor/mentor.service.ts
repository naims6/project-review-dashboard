import { StatusCodes } from "http-status-codes";
import { Temporal } from "temporal-polyfill";
import { db } from "../../../prisma/db.js";
import AppError from "../../utils/AppError.js";

export type ProjectStatusType = "PENDING" | "APPROVED" | "REJECTED";

export interface IGetProjectsQuery {
  page?: string | number;
  limit?: string | number;
  status?: ProjectStatusType;
}

export interface IReviewProjectPayload {
  status: "APPROVED" | "REJECTED";
  reviewComment?: string;
}

const getProjects = async (query: IGetProjectsQuery) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;

  const collection = query.status
    ? db.orm.public.Project.where((p) => p.status.eq(query.status!))
    : db.orm.public.Project;

  const [countResult, projects] = await Promise.all([
    collection.aggregate((a) => ({ count: a.count() })),
    collection
      .include("student", (student) => student.select("id", "name", "email"))
      .orderBy((p) => p.createdAt.desc())
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
  const project = await db.orm.public.Project
    .where({ id })
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

  const updatedProject = await db.orm.public.Project
    .where({ id })
    .update({
      status: payload.status,
      reviewComment: payload.reviewComment ?? null,
      reviewedById: mentorId,
      reviewedAt: Temporal.Now.instant(),
    });

  return updatedProject;
};

const getMentorStats = async () => {
  const [totalResult, pendingResult, approvedResult, rejectedResult] =
    await Promise.all([
      db.orm.public.Project.aggregate((a) => ({ count: a.count() })),
      db.orm.public.Project.where({ status: "PENDING" }).aggregate((a) => ({
        count: a.count(),
      })),
      db.orm.public.Project.where({ status: "APPROVED" }).aggregate((a) => ({
        count: a.count(),
      })),
      db.orm.public.Project.where({ status: "REJECTED" }).aggregate((a) => ({
        count: a.count(),
      })),
    ]);

  return {
    total: totalResult.count,
    pending: pendingResult.count,
    approved: approvedResult.count,
    rejected: rejectedResult.count,
  };
};

export const MentorService = {
  getProjects,
  getProjectById,
  reviewProject,
  getMentorStats,
};
