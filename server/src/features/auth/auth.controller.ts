import {config} from '../../shared/config';
import {Request, Response} from 'express';
import httpStatus from 'http-status';
import {asyncHandler} from '../../shared/utils/async-handler';
import {ApiResponse} from '../../shared/utils/api-response';
import {AuthService} from './auth.service';
import {TAuthRequest, TLogin} from './auth.schema';
import {TAuthenticatedRequest} from '../../shared/types/auth.types';
import {activityService, ActivityType} from '../../shared/services/activity.service';
import {mailService} from '../../shared/services/mail.service';
import {WelcomeEmail} from '../../shared/templates/welcome-email';

import {parseDurationToMs} from '../../shared/utils/duration';

const authService = new AuthService();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and token management
 */
export default class AuthController {
  /**
   * Sets the httpOnly refreshToken cookie on the response.
   */
  private static setRefreshTokenCookie(res: Response, token: string, maxAge?: number) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: maxAge ?? parseDurationToMs(config.REFRESH_TOKEN_DURATION)
    });
  }

  static login = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as TLogin;
    const {accessToken, refreshToken, user} = await authService.login(data);

    AuthController.setRefreshTokenCookie(res, refreshToken);

    // Dynamic Activity Logging
    await activityService.recordActivity(user.id, ActivityType.LOGIN, 'User logged in', {
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    return ApiResponse.success(res, {accessToken, user}, 'Login successful');
  });

  static register = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as TAuthRequest;
    const {accessToken, refreshToken, user} = await authService.register(data);

    AuthController.setRefreshTokenCookie(res, refreshToken);

    // Record Activity
    await activityService.recordActivity(user.id, ActivityType.REGISTER, 'New user registered');

    // Send Welcome Email (Fire and forget or await)
    mailService
      .sendEmail(user.email, 'Welcome to Boilerplate!', WelcomeEmail({name: `${user.firstName} ${user.lastName}`}))
      .catch((err) => console.error('Failed to send welcome email:', err));

    return ApiResponse.success(res, {accessToken, user}, 'Registration successful', httpStatus.CREATED);
  });

  static refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return ApiResponse.error(res, 'Refresh token required', httpStatus.UNAUTHORIZED);
    }

    const {accessToken, refreshToken: newRefreshToken, expiresAt} = await authService.refreshToken(refreshToken);

    // Calculate remaining maxAge for the cookie to match the absolute deadline
    const remainingMs = Math.max(0, expiresAt.getTime() - Date.now());

    // Rotation: Set the brand-new refresh token as the cookie with FIXED deadline
    AuthController.setRefreshTokenCookie(res, newRefreshToken, remainingMs);

    return ApiResponse.success(res, {accessToken}, 'Token refreshed');
  });

  static logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await authService.logout(refreshToken);
    }
    res.clearCookie('refreshToken');
    return ApiResponse.success(res, null, 'Logged out successfully');
  });

  static getMe = asyncHandler(async (req: TAuthenticatedRequest, res: Response) => {
    await Promise.resolve();
    return ApiResponse.success(res, req.user, 'User profile retrieved');
  });
}
