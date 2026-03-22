import {Request, Response} from 'express';
import {asyncHandler} from '../../shared/utils/async-handler';
import {ApiResponse} from '../../shared/utils/api-response';
import {UserService} from './user.service';

const userService = new UserService();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */
export class UserController {
  /**
   * @swagger
   * /user:
   *   get:
   *     summary: Retrieve all users
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Number of users per page
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search by email, first name, or last name
   *     responses:
   *       200:
   *         description: A paginated list of users
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '@/components/schemas/UserPaginatedResponse'
   */
  static getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const {data, total} = await userService.getAllUsers(page, limit, search);

    return ApiResponse.paginated(res, data, {total, page, limit}, 'Users retrieved successfully');
  });

  /**
   * @swagger
   * /user/{id}:
   *   get:
   *     summary: Get user by ID
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *     responses:
   *       200:
   *         description: User data retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '@/components/schemas/User'
   *       404:
   *         description: User not found
   */
  static getUserById = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.params.id as string);
    return ApiResponse.success(res, user, 'User retrieved successfully');
  });
}
