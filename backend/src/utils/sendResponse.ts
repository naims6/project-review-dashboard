import { Response } from "express";

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IApiResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  meta?: IPaginationMeta;
  data: T;
}

export interface IPaginatedResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  meta: IPaginationMeta;
  data: T[];
}

export const sendResponse = <T>(res: Response, data: IApiResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    ...(data.meta ? { meta: data.meta } : {}),
    data: data.data,
  });
};

export const sendPaginatedResponse = <T>(
  res: Response,
  data: IPaginatedResponse<T>,
) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    meta: data.meta,
    data: data.data,
  });
};

export default sendResponse;
