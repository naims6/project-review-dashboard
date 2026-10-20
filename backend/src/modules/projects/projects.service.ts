import { StatusCodes } from "http-status-codes";
import { db } from "../../../prisma/db.js";
import AppError from "../../utils/AppError.js";

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
  // Prevent duplicate submission: repoUrl is unique
  const existing = await db.orm.public.Project.where({
    repoUrl: payload.repoUrl,
  }).first();

  if (existing) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "A project with this repository URL has already been submitted",
    );
  }

  const project = await db.orm.public.Project.create({
    name: payload.name,
    repoUrl: payload.repoUrl,
    liveUrl: payload.liveUrl,
    description: payload.description,
    studentId: studentId,
    status: "PENDING",
  });

  return project;
};

const getMyProjects = async (studentId: string) => {
  const projects = await db.orm.public.Project
    .where((p) => p.studentId.eq(studentId))
    .orderBy((p) => p.createdAt.desc())
    .all();

  return projects;
};

export const ProjectService = {
  createProject,
  getMyProjects,
};
