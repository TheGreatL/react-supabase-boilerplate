import {Router} from 'express';
import authRoute from './features/auth/auth.route';
import uploadRoute from './features/upload/upload.route';
import userRoute from './features/user/user.route';
import healthRoute from './features/health/health.route';
import dashboardRoute from './features/dashboard/dashboard.route';

/**
 * Gold Standard:
 * Routes.ts is the central traffic controller for the API.
 * It gathers all feature-specific routes and mounts them under specific paths.
 */
const routes = Router();

// 1. Health check (unauthenticated — for Docker & uptime monitors)
routes.use('/health', healthRoute);

// 2. Auth related routes (Login, Register, Token Refresh)
routes.use('/auth', authRoute);

// 3. User related routes (Profile management, user retrieval)
routes.use('/user', userRoute);

// 4. Dashboard routes (Stats, Activity)
routes.use('/dashboard', dashboardRoute);

// 5. Upload related routes
routes.use('/upload', uploadRoute);

export default routes;
