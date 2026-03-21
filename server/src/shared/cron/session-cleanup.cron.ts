import cron, {ScheduledTask} from 'node-cron';
import {SessionRepository} from '../../features/auth/session.repository';

const sessionRepository = new SessionRepository();

/**
 * Gold Standard:
 * Cron job to clean up expired sessions every hour.
 * Prevents the sessions table from growing indefinitely.
 * Uses node-cron for reliable scheduling instead of setInterval.
 *
 * Schedule: '0 * * * *' = At minute 0 of every hour.
 */
export function startSessionCleanupCron(): ScheduledTask {
  return cron.schedule('0 * * * *', async () => {
    try {
      const result = await sessionRepository.deleteExpired();
      if (result.count > 0) {
        console.log(`🧹 Cleaned up ${result.count} expired session(s)`);
      }
    } catch (error) {
      console.error('❌ Session cleanup failed:', error);
    }
  });
}
