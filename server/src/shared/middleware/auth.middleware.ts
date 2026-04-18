import {Response, NextFunction} from 'express';
import {TokenService} from '../services/token.service';
import {TAuthenticatedRequest} from '../types/auth.types';
import {UnauthorizedException} from '../exceptions/unauthorized-exception';
import {ForbiddenException} from '../exceptions/forbidden-exception';
import rateLimit from 'express-rate-limit';
import {ApiResponse} from '../utils/api-response';
import {config} from '../config';

/**
 * Gold Standard:
 * AuthMiddleware verifies the presence and validity of the Bearer token.
 * It attaches the decoded user payload to the request for downstream use.
 */
export const authMiddleware = async (req: TAuthenticatedRequest, res: Response, next: NextFunction) => {
  // 1. Extract Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedException('Unauthorized - No token provided'));
  }

  // 2. Extract token from "Bearer <token>"
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verify token using TokenService
    const decoded = await TokenService.verifyAccessToken(token);

    // 4. Attach decoded payload to request for use in controllers
    req.user = decoded;

    // 5. Bind user identity to the pino logger for structured log tracing
    if (req.log) {
      req.log = req.log.child({userId: decoded.id, roles: decoded.roles});
    }

    next();
  } catch {
    return next(new UnauthorizedException('Unauthorized - Invalid or expired token'));
  }
};

/**
 * RBAC Guard Middleware
 *
 * Restricts access to routes based on the user's role.
 * Must be used AFTER authMiddleware.
 *
 * @example
 * route.delete('/:id', authMiddleware, requireRole('ADMIN'), UserController.deleteUser);
 */
export const requireRole = (roles: string | string[]) => {
  return async (req: TAuthenticatedRequest, res: Response, next: NextFunction) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!req.user || !allowedRoles.some((role) => req.user!.roles.includes(role))) {
      throw new ForbiddenException('Insufficient role permissions');
    }

    next();
  };
};

export const authAttemptLimiter =
  config.NODE_ENV === 'test' ?
    (_req: Request, _res: Response, next: NextFunction) => next()
  : rateLimit({
      windowMs: 1000 * 60 * 15,
      limit: 8,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      handler: (req, res) => {
        ApiResponse.error(res, 'You reached the allowed login attempts. Please try again after 15 minutes.', 429);
      }
    });
