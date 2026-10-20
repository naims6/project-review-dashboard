import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { MentorService } from "./mentor.service.js";

const getProjects = catchAsync(async (req: Request, res: Response) => {
  const result = await MentorService.getProjects(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Projects retrieved successfully",
    data: result,
  });
});

const getProjectById = catchAsync(async (req: Request, res: Response) => {
  const result = await MentorService.getProjectById(req.params.id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Project retrieved successfully",
    data: result,
  });
});

const reviewProject = catchAsync(async (req: Request, res: Response) => {
  const result = await MentorService.reviewProject(
    req.params.id as string,
    req.user!.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `Project ${req.body.status.toLowerCase()} successfully`,
    data: result,
  });
});

const getMentorStats = catchAsync(async (_req: Request, res: Response) => {
  const result = await MentorService.getMentorStats();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Mentor stats retrieved successfully",
    data: result,
  });
});

export const MentorController = {
  getProjects,
  getProjectById,
  reviewProject,
  getMentorStats,
};
