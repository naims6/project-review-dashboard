import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse, {
  sendPaginatedResponse,
} from "../../utils/sendResponse.js";
import { AdminService } from "./admin.service.js";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.createUser(req.body);

  const roleLabel =
    req.body.role === "MENTOR"
      ? "Mentor"
      : req.body.role === "STUDENT"
        ? "Student"
        : "User";

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: `${roleLabel} created successfully`,
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllUsers(req.query);

  sendPaginatedResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Users retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const AdminController = {
  createUser,
  getAllUsers,
};
