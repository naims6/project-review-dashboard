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
