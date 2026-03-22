import {Request, Response, NextFunction} from 'express';
import httpStatus from 'http-status';
import {ApiResponse} from '../utils/api-response';
import {logger} from '../lib/logger';
import {HttpException} from '../exceptions/http-exception';
import {config} from '../config';

export const errorMiddleware = (error: any, req: Request, res: Response, _next: NextFunction) => {
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR as number;
  let message = 'Internal Server Error';
  let errors: any = null;

  // 1. Handle Known HttpExceptions
  if (error instanceof HttpException) {
    statusCode = error.statusCode;
    message = error.message;
  }
  // 2. Handle Zod Validation Errors
  else if (error.name === 'ZodError') {
    statusCode = httpStatus.BAD_REQUEST;
    message = 'Validation Error';
    errors = error.errors;
  }
  // 3. Handle Prisma Known Request Errors
  else if (error.code && error.clientVersion) {
    // This is a heuristic for Prisma errors to avoid importing PrismaClientKnownRequestError directly in middleware
    statusCode = httpStatus.BAD_REQUEST;
    message = 'Database operation failed';
    if (config.NODE_ENV === 'development') {
      errors = {
        code: error.code,
        meta: error.meta,
        message: error.message
      };
    }
  }
  // 4. Handle generic Error objects
  else if (error instanceof Error) {
    message = error.message;
  }

  // Log the error with stack trace in development
  logger.error(`${req.method} ${req.path} - ${statusCode} - ${message}`, {
    stack: config.NODE_ENV === 'development' ? error.stack : undefined,
    errors,
    originalError: config.NODE_ENV === 'development' ? error : undefined
  });

  // Re-format internal server error message in production to avoid leaking details
  if (config.NODE_ENV === 'production' && statusCode === httpStatus.INTERNAL_SERVER_ERROR) {
    message = 'Something went wrong on our end';
  }

  ApiResponse.error(res, message, statusCode, errors);
};
