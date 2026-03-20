import {Request, Response, NextFunction} from 'express';
import {ApiResponse} from '../utils/api-response';
import {logger} from '../lib/logger';
import {HttpException} from '../exceptions/http-exception';

export const errorMiddleware = (error: any, req: Request, res: Response, _next: NextFunction) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors = null;

  if (error instanceof HttpException) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  // Handle specific errors like Zod validation if needed
  if (error.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = error.errors;
  }

  logger.error(`${req.method} ${req.path} - ${statusCode} - ${message}`, {
    stack: error.stack,
    errors
  });

  ApiResponse.error(res, message, statusCode, errors);
};
