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

import {authorize} from '../../shared/middleware/rbac.middleware';

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
route.get('/', authMiddleware, authorize('USERS', 'READ'), UserController.getAllUsers);

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
route.get('/:id', authMiddleware, authorize('USERS', 'READ'), UserController.getUserById);

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
 * /user/profile/photo:
 *   patch:
 *     summary: Update current user profile photo
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 */
import {upload} from '../../shared/middleware/upload.middleware';
route.patch('/profile/photo', authMiddleware, upload.single('photo'), UserController.updateProfilePhoto);

export default route;
