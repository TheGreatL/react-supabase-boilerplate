import {Request, Response, NextFunction} from 'express';
import {ApiResponse} from '../utils/api-response';
import {TokenService} from '../services/token.service';

import {TJWTPayload} from '../types/auth.types';

/**
 * Gold Standard:
 * AuthenticatedRequest extends the standard Express Request to include
 * the decoded user payload from the JWT.
 */
export interface TAuthenticatedRequest extends Request {
  user?: TJWTPayload;
}

/**
 * Gold Standard:
 * authMiddleware is a guard for protected routes. It extracts the Bearer token
 * from the Authorization header, verifies it asynchronously using TokenService,
 * and attaches the decoded user to the request object.
 */
export const authMiddleware = async (req: TAuthenticatedRequest, res: Response, next: NextFunction) => {
  // 1. Extract Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ApiResponse.error(res, 'Unauthorized - No token provided', 401);
  }

  // 2. Extract token from "Bearer <token>"
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verify token asynchronously using TokenService (requested async/await)
    const decoded = await TokenService.verifyAccessToken(token);

    // 4. Attach decoded payload to request for use in controllers
    req.user = decoded;

    // 5. Proceed to next middleware or controller
    next();
  } catch {
    // 6. Return error if token is invalid or expired
    return ApiResponse.error(res, 'Unauthorized - Invalid or expired token', 401);
  }
};
