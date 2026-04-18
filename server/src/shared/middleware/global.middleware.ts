import rateLimit from 'express-rate-limit';
import {config} from '../config';
import type {NextFunction} from 'express';

// Skip limiting in test environment to avoid flaky integration tests
const isTest = config.NODE_ENV === 'test';

export const globalLimiter =
  isTest ?
    (_req: any, _res: any, next: NextFunction) => next()
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: 'Too many requests from this IP, please try again after 15 minutes'
    });

export const csrfInitLimiter =
  isTest ?
    (_req: any, _res: any, next: NextFunction) => next()
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 20,
      message: 'Too many CSRF init requests, please try again later'
    });

export const authLimiter =
  isTest ?
    (_req: any, _res: any, next: NextFunction) => next()
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10,
      standardHeaders: true,
      legacyHeaders: false,
      message: 'Too many authentication attempts, please try again after 15 minutes'
    });
