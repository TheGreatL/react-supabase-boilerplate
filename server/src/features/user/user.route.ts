import {Router} from 'express';
import {UserController} from './user.controller';
import {authMiddleware} from '../../shared/middleware/auth.middleware';
import {upload} from '../../shared/middleware/upload.middleware';
import {validateSchema} from '../../shared/middleware/schema-validate.middleware';
import {updateProfileSchema, userByIdParamsSchema} from './user.schema';

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
 * /user:
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
 * /user/{id}:
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
 *           $ref: '#/components/schemas/UserByIdParams'
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserRequest'
 */
route.get('/:id', authMiddleware, authorize('USERS', 'READ'), validateSchema(userByIdParamsSchema, 'params'), UserController.getUserById);

/**
 * @swagger
 * /user/profile:
 *   patch:
 *     summary: Update current user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
route.patch('/profile', authMiddleware, validateSchema(updateProfileSchema), UserController.updateProfile);

/**
 * @swagger
 * /user/profile/photo:
 *   patch:
 *     summary: Update current user profile photo
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 */
route.patch('/profile/photo', authMiddleware, upload.single('photo'), UserController.updateProfilePhoto);

export default route;
