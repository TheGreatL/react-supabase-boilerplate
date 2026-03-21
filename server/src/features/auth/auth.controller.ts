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
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and token management
 */
export default class AuthController {
  private static setRefreshTokenCookie(res: Response, token: string, maxAge?: number) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: maxAge ?? parseDurationToMs(config.REFRESH_TOKEN_DURATION)
    });
  }

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login to the application
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '@/components/schemas/LoginRequest'
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '@/components/schemas/AuthResponse'
   *       401:
   *         description: Invalid credentials
   */
  static login = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as TLogin;
    const {accessToken, refreshToken} = await authService.login(data);

    AuthController.setRefreshTokenCookie(res, refreshToken);

    return ApiResponse.success(res, {accessToken}, 'Login successful');
  });

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '@/components/schemas/RegisterRequest'
   *     responses:
   *       201:
   *         description: Registration successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '@/components/schemas/AuthResponse'
   *       400:
   *         description: User already exists
   */
  static register = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as TAuthRequest;
    const {accessToken, refreshToken} = await authService.register(data);

    AuthController.setRefreshTokenCookie(res, refreshToken);

    return ApiResponse.success(res, {accessToken}, 'Registration successful', httpStatus.CREATED);
  });

  /**
   * @swagger
   * /auth/refresh:
   *   post:
   *     summary: Refresh access token
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: Token refreshed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     accessToken:
   *                       type: string
   *       401:
   *         description: Refresh token required or invalid
   */
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

  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     summary: Logout from the application
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: Logged out successfully
   */
  static logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await authService.logout(refreshToken);
    }
    res.clearCookie('refreshToken');
    return ApiResponse.success(res, null, 'Logged out successfully');
  });

  /**
   * @swagger
   * /auth/me:
   *   get:
   *     summary: Get current user profile
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User profile retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   $ref: '@/components/schemas/User'
   *       401:
   *         description: Unauthorized
   */
  static getMe = asyncHandler(async (req: TAuthenticatedRequest, res: Response) => {
    await Promise.resolve();
    return ApiResponse.success(res, req.user, 'User profile retrieved');
  });
}
