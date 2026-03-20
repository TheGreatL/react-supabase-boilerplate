import {Request, Response} from 'express';
import {asyncHandler} from '../../shared/utils/async-handler';
import {ApiResponse} from '../../shared/utils/api-response';
import {AuthService} from './auth.service';
import {TLogin} from './auth.schema';
import {TAuthenticatedRequest} from '../../shared/middleware/auth.middleware';

const authService = new AuthService();

export default class AuthController {
  private static setRefreshTokenCookie(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days (should ideally match REFRESH_TOKEN_DURATION)
    });
  }

  static login = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as TLogin;
    const {accessToken, refreshToken} = await authService.login(data);

    AuthController.setRefreshTokenCookie(res, refreshToken);

    return ApiResponse.success(res, {accessToken}, 'Login successful');
  });

  static register = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as TLogin;
    const {accessToken, refreshToken} = await authService.register(data);

    AuthController.setRefreshTokenCookie(res, refreshToken);

    return ApiResponse.success(res, {accessToken}, 'Registration successful', 201);
  });

  static refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return ApiResponse.error(res, 'Refresh token required', 401);
    }

    const accessToken = await authService.refreshToken(refreshToken);
    return ApiResponse.success(res, {accessToken}, 'Token refreshed');
  });

  static logout = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie('refreshToken');
    await Promise.resolve();
    return ApiResponse.success(res, null, 'Logged out successfully');
  });

  static getMe = asyncHandler(async (req: TAuthenticatedRequest, res: Response) => {
    await Promise.resolve();
    return ApiResponse.success(res, req.user, 'User profile retrieved');
  });
}
