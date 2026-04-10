import { prisma } from '../../shared/lib/prisma';

export class DashboardRepository {
  /**
   * Get total number of users
   */
  async getUserCount(): Promise<number> {
    return prisma.user.count();
  }

  /**
   * Get total number of activities
   */
  async getActivityCount(): Promise<number> {
    return await prisma.activity.count();
  }

  /**
   * Get total number of active users for a specific date (mocked for now)
   */
  async getActiveUsersCount(_date: Date): Promise<number> {
    // In a real app, this would query a sessions table or activity logs
    const total = await this.getUserCount();
    return Math.floor(total * 0.4);
  }
}

export const dashboardRepository = new DashboardRepository();
