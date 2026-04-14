import {Router} from 'express';
import AuthController from './auth.controller';
import {validateSchema} from '../../shared/middleware/schema-validate.middleware';
import {loginSchema, authSchema} from './auth.schema';
import {authMiddleware, authAttemptLimiter} from '../../shared/middleware/auth.middleware';
import {ApiResponse} from '../../shared/utils/api-response';
import {csrfInitLimiter} from '../../shared/middleware/global.middleware';

const route = Router();

route.post('/login', authAttemptLimiter, validateSchema(loginSchema), AuthController.login);
route.post('/register', authAttemptLimiter, validateSchema(authSchema), AuthController.register);
route.post('/refresh', AuthController.refresh);
route.post('/logout', AuthController.logout);
route.get('/me', authMiddleware, AuthController.getMe);

/**
 * CSRF Initialization Endpoint
 * Public GET endpoint used by the frontend to obtain a CSRF token cookie on startup.
 */
route.get('/csrf', csrfInitLimiter, (req, res) => {
  return ApiResponse.success(res, {initialized: true});
});

export default route;
