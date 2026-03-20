import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {config} from '../config';
import {ApiResponse} from '../utils/api-response';
import {HttpException} from '../exceptions/http-exception';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ApiResponse.error(res, 'Unauthorized - No token provided', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    return ApiResponse.error(res, 'Unauthorized - Invalid token', 401);
  }
};
