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
}
