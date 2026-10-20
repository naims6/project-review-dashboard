import { db } from "../../../prisma/db.js";

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
