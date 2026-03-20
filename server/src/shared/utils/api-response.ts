import {Response} from 'express';

export class ApiResponse<T = any> {
  public success: boolean;
  public message: string;
  public data?: T;
  public errors?: any;
  public statusCode: number;

  constructor(statusCode: number, message: string, data?: T, errors?: any) {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    this.errors = errors;
    this.statusCode = statusCode;
  }

  static success<T>(res: Response, data: T, message = 'Success', statusCode = 200) {
    const response = new ApiResponse(statusCode, message, data);
    return res.status(statusCode).json(response);
  }

  static error(res: Response, message = 'Error', statusCode = 500, errors?: any) {
    const response = new ApiResponse(statusCode, message, undefined, errors);
    return res.status(statusCode).json(response);
  }
}
