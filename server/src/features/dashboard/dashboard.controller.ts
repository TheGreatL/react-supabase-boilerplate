import { Response } from 'express';
import { asyncHandler } from '../../shared/utils/async-handler';
import { ApiResponse } from '../../shared/utils/api-response';
import { activityService } from '../../shared/services/activity.service';
import { TAuthenticatedRequest } from '../../shared/types/auth.types';
import { dashboardService } from './dashboard.service';

export default class DashboardController {
  /**
   * Get Dashboard Statistics
   */
  static getStats = asyncHandler(async (req: TAuthenticatedRequest, res: Response) => {
    const stats = await dashboardService.getDashboardStats();
    return ApiResponse.success(res, stats, 'Dashboard stats retrieved');
  });

  /**
   * Get Recent Activities
   */
  static getActivities = asyncHandler(async (req: TAuthenticatedRequest, res: Response) => {
    const activities = await activityService.getRecentActivities(10);
    return ApiResponse.success(res, activities, 'Recent activities retrieved');
  });
}
