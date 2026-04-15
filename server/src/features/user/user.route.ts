import {Router} from 'express';
import {UserController} from './user.controller';
import {authMiddleware} from '../../shared/middleware/auth.middleware';

const route = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management and profile operations
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
route.get('/', authMiddleware, UserController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 */
route.get('/:id', authMiddleware, UserController.getUserById);

/**
 * @swagger
 * /user/profile:
 *   patch:
 *     summary: Update current user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 */
route.patch('/profile', authMiddleware, UserController.updateProfile);

/**
 * @swagger
 * /user/profile/avatar:
 *   patch:
 *     summary: Update current user avatar
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 */
import {upload} from '../../shared/middleware/upload.middleware';
route.patch('/profile/avatar', authMiddleware, upload.single('avatar'), UserController.updateAvatar);

export default route;
