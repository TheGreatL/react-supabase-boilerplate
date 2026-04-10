import express, {json, urlencoded, type Request, type Response} from 'express';
import routes from './routes';
import helmet from 'helmet';
import cors from 'cors';
import httpStatus from 'http-status';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import {config} from './shared/config';
import {errorMiddleware} from './shared/middleware/error.middleware';
import {ApiResponse} from './shared/utils/api-response';
import swaggerUi from 'swagger-ui-express';
import {swaggerSpec} from './shared/lib/swagger';
import {rateLimit} from 'express-rate-limit';
import {logger} from './shared/lib/logger';
import {csrfMiddleware} from './shared/middleware/csrf.middleware';

/**
 * Gold Standard:
 * App.ts is the main Express application configuration.
 * It sets up middleware, security headers, routing, and error handling.
 */
const app = express();

// 1. Core Middleware
app.use(json()); // Parse JSON request bodies
app.use(urlencoded({extended: true})); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies (used for refresh tokens & CSRF)

// 2. Global Logging (Pino)
app.use(
  pinoHttp({
    logger,
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params
      })
    }
  })
);

// 3. Security Middleware
app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true // Allow cookies to be sent cross-origin
  })
);
app.use(helmet()); // Set various HTTP headers for security
app.use(csrfMiddleware); // Prevent Cross-Site Request Forgery

// 4. Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', globalLimiter);

// 5. API Routes
app.use('/api', routes);

// 6. Swagger API Documentation (accessible at /api/docs)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 7. 404 Handler for undefined routes
app.use((req: Request, res: Response) => {
  ApiResponse.error(res, 'Resource not found', httpStatus.NOT_FOUND);
});

// 8. Global Error Handler (Must be last)
app.use(errorMiddleware);

export default app;
