import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import httpStatus from 'http-status';
import { ApiResponse } from '../utils/api-response';

/**
 * CSRF Protection Middleware (Double Submit Cookie Pattern)
 * 
 * 1. State-changing requests (POST, PUT, DELETE, PATCH) must include:
 *    - A 'X-CSRF-Token' header.
 *    - A matching 'csrf-token' cookie.
 * 2. GET requests are allowed and set the cookie if not present.
 */
export const csrfMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Methods that don't need CSRF protection
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  
  if (safeMethods.includes(req.method)) {
    // Set a new CSRF token if one doesn't exist
    if (!req.cookies['csrf-token']) {
      const token = crypto.randomBytes(32).toString('hex');
      res.cookie('csrf-token', token, {
        httpOnly: false, // Must be accessible by client JS to read and send back in header
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      });
    }
    return next();
  }

  // Verify CSRF token for state-changing methods
  const headerToken = req.headers['x-csrf-token'];
  const cookieToken = req.cookies['csrf-token'];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return ApiResponse.error(
      res, 
      'CSRF token validation failed', 
      httpStatus.FORBIDDEN
    );
  }

  next();
};
