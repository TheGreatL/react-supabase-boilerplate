import {dashboardRepository, DashboardRepository} from './dashboard.repository';

export class DashboardService {
  constructor(private repository: DashboardRepository = dashboardRepository) {}

  /**
   * Get formatted dashboard statistics
   */
  async getDashboardStats() {
    const [userCount, activityCount, activeToday] = await Promise.all([
      this.repository.getUserCount(),
      this.repository.getActivityCount(),
      this.repository.getActiveUsersCount(new Date())
    ]);

    return {
      totalUsers: userCount,
      totalActivities: activityCount,
      activeUsersToday: activeToday,
      growthRate: '+12.5%' // Hardcoded for boilerplate example
    };
  }
}

export const dashboardService = new DashboardService();
