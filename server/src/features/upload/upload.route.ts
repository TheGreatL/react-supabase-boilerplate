import {Router} from 'express';
import {authMiddleware} from '../../shared/middleware/auth.middleware';
import {upload} from '../../shared/middleware/upload.middleware';
import UploadController from './upload.controller';

const router = Router();

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a single file
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               folder:
 *                 type: string
 *     responses:
 *       201:
 *         description: File uploaded successfully
 */
router.post('/', authMiddleware, upload.single('file'), UploadController.uploadSingle);

export default router;
