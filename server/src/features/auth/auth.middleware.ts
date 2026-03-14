import rateLimit from 'express-rate-limit';
import { ApiResponse } from '../../shared/utils/api-response';

export default function authAttemptLimiter() {
  return rateLimit({
    windowMs: 1000 * 60 * 15, // 15 minutes
    limit: 8,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (req, res) => {
      ApiResponse.error(
        res,
        'You reached the allowed login attempts. Please try again after 15 minutes.',
        429
      );
    },
  });
}
