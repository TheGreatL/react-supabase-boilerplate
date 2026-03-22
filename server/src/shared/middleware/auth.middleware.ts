import {Response, NextFunction} from 'express';
import httpStatus from 'http-status';
import {TokenService} from '../services/token.service';
import {ApiResponse} from '../utils/api-response';
import {TAuthenticatedRequest} from '../types/auth.types';
import rateLimit from 'express-rate-limit';

/**
 * Gold Standard:
 * AuthMiddleware verifies the presence and validity of the Bearer token.
 * It is asynchronous to support TokenService verification logic.
 */
export const authMiddleware = async (req: TAuthenticatedRequest, res: Response, next: NextFunction) => {
  // 1. Extract Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ApiResponse.error(res, 'Unauthorized - No token provided', httpStatus.UNAUTHORIZED);
  }

  // 2. Extract token from "Bearer <token>"
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verify token asynchronously using TokenService
    const decoded = await TokenService.verifyAccessToken(token);

    // 4. Attach decoded payload to request for use in controllers
    req.user = decoded;

    // 5. Proceed to next middleware or controller
    next();
  } catch {
    // 6. Return error if token is invalid or expired
    return ApiResponse.error(res, 'Unauthorized - Invalid or expired token', httpStatus.UNAUTHORIZED);
  }
};

export const authAttemptLimiter = rateLimit({
  windowMs: 1000 * 60 * 15, // 15 minutes
  limit: 8,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (req, res) => {
    ApiResponse.error(res, 'You reached the allowed login attempts. Please try again after 15 minutes.', 429);
  }
});
