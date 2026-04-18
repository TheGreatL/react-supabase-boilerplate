import {Request, Response, NextFunction} from 'express';
import {ZodType, ZodError} from 'zod';
import httpStatus from 'http-status';
import {ApiResponse} from '../utils/api-response';

export const validateSchema = (schema: ZodType, type: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Override with parsed data to support coercion and defaults
      req[type] = schema.parse(req[type]);
      next();
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        return ApiResponse.error(res, 'Validation error', httpStatus.BAD_REQUEST, err.issues);
      }
      next(err);
    }
  };
};
