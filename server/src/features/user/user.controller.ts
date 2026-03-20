import {Request, Response} from 'express';
import {asyncHandler} from '../../shared/utils/async-handler';
import {ApiResponse} from '../../shared/utils/api-response';
import {UserService} from './user.service';

const userService = new UserService();

export class UserController {
  static getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await userService.getAllUsers();
    return ApiResponse.success(res, users, 'Users retrieved successfully');
  });

  static getUserById = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.params.id as string);
    return ApiResponse.success(res, user, 'User retrieved successfully');
  });

  static updateProfile = asyncHandler(async (req: Request, res: Response) => {
    // Usually you'd get the ID from req.user for profile updates
    const userId = (req as any).user.id;
    const user = await userService.updateUser(userId, req.body);
    return ApiResponse.success(res, user, 'Profile updated successfully');
  });
}
