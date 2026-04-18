import {Router} from 'express';
import {authMiddleware} from '../../shared/middleware/auth.middleware';
import {upload} from '../../shared/middleware/upload.middleware';
import {validateSchema} from '../../shared/middleware/schema-validate.middleware';
import {uploadSingleSchema} from './upload.schema';
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
 *             $ref: '#/components/schemas/UploadSingleRequest'
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 */
router.post('/', authMiddleware, upload.single('file'), validateSchema(uploadSingleSchema), UploadController.uploadSingle);

export default router;
