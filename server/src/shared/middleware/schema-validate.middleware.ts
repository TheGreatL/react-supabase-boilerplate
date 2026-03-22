import {Request, Response, NextFunction} from 'express';
import {ZodType} from 'zod';
import httpStatus from 'http-status';
import {ApiResponse} from '../utils/api-response';

export const validateSchema = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'ZodError') {
        const zodError = err as import('zod').ZodError;
        return ApiResponse.error(res, 'Validation error', httpStatus.BAD_REQUEST, zodError.issues);
      }
      next(err);
    }
  };
};
