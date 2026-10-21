import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse, { sendPaginatedResponse } from "../../utils/sendResponse.js";
import { ProjectService } from "./projects.service.js";

const createProject = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectService.createProject(req.user!.id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Project submitted successfully",
    data: result,
  });
});

const getMyProjects = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectService.getMyProjects(req.user!.id, req.query);

  sendPaginatedResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Projects retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getProjectById = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectService.getProjectById(
    req.params.id as string,
    req.user!.id,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Project retrieved successfully",
    data: result,
  });
});

export const ProjectController = {
  createProject,
  getMyProjects,
  getProjectById,
};
