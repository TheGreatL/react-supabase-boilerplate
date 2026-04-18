import {db} from '../../shared/database/db';
import {active} from '../../shared/lib/db-utils';

export class DashboardRepository {
  /**
   * Get total number of users
   */
  async getUserCount(): Promise<number> {
    const result = await db
      .selectFrom('Users')
      .select(db.fn.count<number>('id').as('count'))
      .where(active)
      .executeTakeFirst();

    return Number(result?.count || 0);
  }

  /**
   * Get total number of activities
   */
  async getActivityCount(): Promise<number> {
    const result = await db.selectFrom('ActivityLogs').select(db.fn.count<number>('id').as('count')).executeTakeFirst();

    return Number(result?.count || 0);
  }

  /**
   * Get total number of active users for a specific date (mocked for now)
   */
  async getActiveUsersCount(_date: Date): Promise<number> {
    const total = await this.getUserCount();
    return Math.floor(total * 0.4);
  }
}

export const dashboardRepository = new DashboardRepository();
