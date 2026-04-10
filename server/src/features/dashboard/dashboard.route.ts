import {Router} from 'express';
import DashboardController from './dashboard.controller';
import {authMiddleware} from '../../shared/middleware/auth.middleware';

const route = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: System overview and statistics
 */

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardStats'
 */
route.get('/stats', authMiddleware, DashboardController.getStats);

/**
 * @swagger
 * /dashboard/activities:
 *   get:
 *     summary: Get recent system activities
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent activities retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardActivities'
 */
route.get('/activities', authMiddleware, DashboardController.getActivities);

export default route;
