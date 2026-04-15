import {Router, Request, Response} from 'express';
import {db} from '../../shared/database/db';

const router = Router();

/**
 * GET /api/health
 * Returns API and database health status.
 * Intentionally unauthenticated — used by uptime monitors and Docker health checks.
 */
router.get('/', async (req: Request, res: Response) => {
  let dbStatus: 'ok' | 'error' = 'ok';

  try {
    // Lightweight DB ping — no table scan
    await db.selectFrom('User').select('id').limit(1).execute();
  } catch {
    dbStatus = 'error';
  }

  const status = dbStatus === 'ok' ? 200 : 503;

  return res.status(status).json({
    success: dbStatus === 'ok',
    status: dbStatus === 'ok' ? 'healthy' : 'degraded',
    services: {
      api: 'ok',
      database: dbStatus
    },
    timestamp: new Date().toISOString()
  });
});

export default router;
