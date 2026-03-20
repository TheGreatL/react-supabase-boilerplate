import {Request, Response} from 'express';
import {asyncHandler} from '../../shared/utils/async-handler';
import {ApiResponse} from '../../shared/utils/api-response';
import {AuthService} from './auth.service';
import {TLogin} from './auth.schema';
import {AuthenticatedRequest} from '../../shared/middleware/auth.middleware';

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
    const {email, password} = req.body as TLogin;
    const {user, accessToken, refreshToken} = await authService.login(email, password);

    AuthController.setRefreshTokenCookie(res, refreshToken);

    return ApiResponse.success(res, {user, accessToken}, 'Login successful');
  });

  static register = asyncHandler(async (req: Request, res: Response) => {
    const {user, accessToken, refreshToken} = await authService.register(req.body);

    AuthController.setRefreshTokenCookie(res, refreshToken);

    return ApiResponse.success(res, {user, accessToken}, 'Registration successful', 201);
  });

  static refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return ApiResponse.error(res, 'Refresh token required', 401);
    }

    const result = await authService.refreshToken(refreshToken);
    return ApiResponse.success(res, result, 'Token refreshed');
  });

  static logout = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie('refreshToken');
    return ApiResponse.success(res, null, 'Logged out successfully');
  });

  static getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    return ApiResponse.success(res, req.user, 'User profile retrieved');
  });
}
