import {Request, Response} from 'express';
import {asyncHandler} from '../../shared/utils/async-handler';
import {ApiResponse} from '../../shared/utils/api-response';
import {UserService} from './user.service';

const userService = new UserService();

export class UserController {
  static getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const {data, total} = await userService.getAllUsers(page, limit, search);

    return ApiResponse.paginated(res, data, {total, page, limit}, 'Users retrieved successfully');
  });

  static getUserById = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.params.id as string);
    return ApiResponse.success(res, user, 'User retrieved successfully');
  });
}
