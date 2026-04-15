import {Router} from 'express';
import authRoute from './features/auth/auth.route';
import userRoute from './features/user/user.route';
import healthRoute from './features/health/health.route';

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
import dashboardRoute from './features/dashboard/dashboard.route';
routes.use('/dashboard', dashboardRoute);

export default routes;

