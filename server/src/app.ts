import express, {json, urlencoded, type Request, type Response} from 'express';
import routes from './routes';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import {config} from './shared/config';
import {errorMiddleware} from './shared/middleware/error.middleware';
import {ApiResponse} from './shared/utils/api-response';
import swaggerUi from 'swagger-ui-express';
import {swaggerSpec} from './shared/lib/swagger';

const app = express();
app.use(json());
app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true
  })
);
app.use(helmet());
app.use(urlencoded({extended: true}));
app.use(cookieParser());

app.use(morgan('dev'));
app.use('/api', routes);

// Swagger API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 Handler
app.use((req: Request, res: Response) => {
  ApiResponse.error(res, 'Resource not found', 404);
});

// Global Error Handler
app.use(errorMiddleware);

export default app;
