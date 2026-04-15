import {config} from '../../shared/config';
import {Request, Response} from 'express';
import httpStatus from 'http-status';
import {asyncHandler} from '../../shared/utils/async-handler';
import {ApiResponse} from '../../shared/utils/api-response';
import {AuthService} from './auth.service';
import {TAuthRequest, TLogin} from './auth.schema';
import {TAuthenticatedRequest} from '../../shared/types/auth.types';
import {parseDurationToMs} from '../../shared/utils/duration';

const authService = new AuthService();

/**
 * Gold Standard:
 * AuthController handles the translation of HTTP requests to AuthService calls.
 * Integrated with ActivityService for audit logging (via AuthService).
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

    return ApiResponse.success(res, {accessToken, user}, 'Login successful');
  });

  static register = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as TAuthRequest;
    const {accessToken, refreshToken, user} = await authService.register(data);

    AuthController.setRefreshTokenCookie(res, refreshToken);
    return ApiResponse.success(res, {accessToken, user}, 'Registration successful', httpStatus.CREATED);
  });

  static refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return ApiResponse.error(res, 'Refresh token required', httpStatus.UNAUTHORIZED);
    }

    const {accessToken, refreshToken: newRefreshToken, expiresAt} = await authService.refreshToken(refreshToken);

    // Diagnostics: Check for clock skew
    console.log('[Auth] Refresh successful:', {
      now: new Date().toISOString(),
      sessionExpiresAt: expiresAt.toISOString(),
      remainingMs: expiresAt.getTime() - Date.now(),
    });

    // Calculate remaining maxAge for the cookie to match the absolute deadline
    const remainingMs = Math.max(0, expiresAt.getTime() - Date.now());

    // Rotation: Set the brand-new refresh token as the cookie with FIXED deadline
    AuthController.setRefreshTokenCookie(res, newRefreshToken, remainingMs);

    return ApiResponse.success(res, {accessToken}, 'Token refreshed');
  });

  static logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      // Pass user ID if they happen to be authenticated (token in header)
      const authenticatedReq = req as TAuthenticatedRequest;
      await authService.logout(refreshToken, authenticatedReq.user?.id);
    }
    res.clearCookie('refreshToken');
    return ApiResponse.success(res, null, 'Logged out successfully');
  });

  static getMe = asyncHandler(async (req: TAuthenticatedRequest, res: Response) => {
    const userService = new (await import('../user/user.service')).UserService();
    if (!req.user) return ApiResponse.error(res, 'Unauthenticated', httpStatus.UNAUTHORIZED);
    
    const user = await userService.getUserById(req.user.id);
    return ApiResponse.success(res, user, 'User profile retrieved');
  });
}
