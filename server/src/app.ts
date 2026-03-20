import express, {json, urlencoded, type Request, type Response} from 'express';
import routes from './routes';
import helmet from 'helmet';
import cors from 'cors';
import httpStatus from 'http-status';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import {config} from './shared/config';
import {errorMiddleware} from './shared/middleware/error.middleware';
import {ApiResponse} from './shared/utils/api-response';
import swaggerUi from 'swagger-ui-express';
import {swaggerSpec} from './shared/lib/swagger';

/**
 * Gold Standard:
 * App.ts is the main Express application configuration.
 * It sets up middleware, security headers, routing, and error handling.
 */
const app = express();

// 1. Core Middleware
app.use(json()); // Parse JSON request bodies
app.use(urlencoded({extended: true})); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies (used for refresh tokens)

// 2. Security Middleware
app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true // Allow cookies to be sent cross-origin
  })
);
app.use(helmet()); // Set various HTTP headers for security

// 3. Logging
app.use(morgan('dev')); // Request logging

// 4. API Routes
app.use('/api', routes);

// 5. Swagger API Documentation (accessible at /api/docs)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 6. 404 Handler for undefined routes
app.use((req: Request, res: Response) => {
  ApiResponse.error(res, 'Resource not found', httpStatus.NOT_FOUND);
});

// 7. Global Error Handler (Must be last)
app.use(errorMiddleware);

export default app;
