import {Response} from 'express';
import httpStatus from 'http-status';

export class ApiResponse<T> {
  public success: boolean;
  public message: string;
  public data?: T;
  public errors?: any;
  public statusCode: number;

  constructor(statusCode: number, message: string, data?: T, errors?: any) {
    this.success = statusCode < httpStatus.BAD_REQUEST;
    this.message = message;
    this.data = data;
    this.errors = errors;
    this.statusCode = statusCode;
  }

  static success<T>(res: Response, data: T, message = 'Success', statusCode: number = httpStatus.OK) {
    const response = new ApiResponse(statusCode, message, data);
    return res.status(statusCode).json(response);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    meta: {total: number; page: number; limit: number},
    message = 'Success',
    statusCode: number = httpStatus.OK
  ) {
    const totalPages = Math.ceil(meta.total / meta.limit);
    const response = {
      success: true,
      message,
      data,
      meta: {
        ...meta,
        totalPages,
        hasNextPage: meta.page < totalPages,
        hasPrevPage: meta.page > 1
      }
    };
    return res.status(statusCode).json(response);
  }

  static error(res: Response, message = 'Error', statusCode: number = httpStatus.INTERNAL_SERVER_ERROR, errors?: any) {
    const response = new ApiResponse(statusCode, message, undefined, errors);
    return res.status(statusCode).json(response);
  }
}
