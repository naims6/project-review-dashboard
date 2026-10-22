import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
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

export const AdminController = {
  createUser,
};
