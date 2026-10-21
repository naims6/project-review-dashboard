import { StatusCodes } from "http-status-codes";
import { db } from "../../../prisma/db.js";
import AppError from "../../utils/AppError.js";
import {
  calculatePagination,
  IPaginationMeta,
  IPaginationOptions,
} from "../../utils/pagination.js";

export interface ICreateProjectPayload {
  name: string;
  repoUrl: string;
  liveUrl: string;
  description: string;
}

const createProject = async (
  studentId: string,
  payload: ICreateProjectPayload,
) => {
  // Prevent duplicate submissions: check both project name (for this student) and repoUrl
  const [existingByName, existingByRepo] = await Promise.all([
    db.orm.public.Project
      .where((p) => p.studentId.eq(studentId))
      .where((p) => p.name.ilike(payload.name.trim()))
      .first(),
    db.orm.public.Project.where({
      repoUrl: payload.repoUrl.trim(),
    }).first(),
  ]);

  if (existingByName) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "You have already submitted a project with this name",
    );
  }

  if (existingByRepo) {
    throw new AppError(
      StatusCodes.CONFLICT,
      existingByRepo.studentId === studentId
        ? "You have already submitted a project with this repository URL"
        : "A project with this repository URL has already been submitted",
    );
  }

  const project = await db.orm.public.Project.create({
    name: payload.name.trim(),
    repoUrl: payload.repoUrl.trim(),
    liveUrl: payload.liveUrl.trim(),
    description: payload.description.trim(),
    studentId: studentId,
    status: "PENDING",
  });

  return project;
};

const getMyProjects = async (
  studentId: string,
  query: IPaginationOptions = {},
) => {
  const { page, limit, offset } = calculatePagination(query);

  const collection = db.orm.public.Project.where((p) =>
    p.studentId.eq(studentId),
  );

  const [countResult, projects] = await Promise.all([
    collection.aggregate((a) => ({ count: a.count() })),
    collection
      .select("id", "name", "repoUrl", "liveUrl", "status", "createdAt")
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

const getProjectById = async (id: string, studentId: string) => {
  const project = await db.orm.public.Project
    .where({ id, studentId })
    .include("reviewedBy", (mentor) => mentor.select("id", "name", "email"))
    .first();

  if (!project) {
    throw new AppError(StatusCodes.NOT_FOUND, "Project not found");
  }

  return project;
};

export const ProjectService = {
  createProject,
  getMyProjects,
  getProjectById,
};
