import pino from 'pino';
import { config } from '../config';

/**
 * Gold Standard:
 * Pino is used for structured logging.
 * In development, it uses 'pino-pretty' for readability.
 * In production, it logs JSON for high-performance ingestion.
 */
export const logger = pino({
  level: config.NODE_ENV === 'development' ? 'debug' : 'info',
  transport: config.NODE_ENV === 'development' 
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
          translateTime: 'SYS:standard'
        }
      }
    : undefined
});
