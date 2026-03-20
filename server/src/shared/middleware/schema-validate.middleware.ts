import {Request, Response, NextFunction} from 'express';
import {ZodSchema} from 'zod';
import httpStatus from 'http-status';
import {ApiResponse} from '../utils/api-response';

export const validateSchema = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return ApiResponse.error(res, 'Validation error', httpStatus.BAD_REQUEST, err.issues);
      }
      next(err);
    }
  };
};
