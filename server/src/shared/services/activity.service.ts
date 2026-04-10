import {prisma} from '../lib/prisma';

export enum ActivityType {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  PROFILE_UPDATE = 'PROFILE_UPDATE',
  LOGOUT = 'LOGOUT'
}

/**
 * Activity Service
 * Handles recording user interactions in the database.
 */
export class ActivityService {
  /**
   * Record a new activity
   */
  async recordActivity(userId: string, type: ActivityType, action: string, metadata?: any) {
    try {
      return await prisma.activity.create({
        data: {
          userId,
          type,
          action,
          metadata: metadata || {}
        }
      });
    } catch (error) {
      console.error('Failed to record activity:', error);
      // We don't throw here to avoid failing the main request if logging fails
    }
  }

  /**
   * Get recent activities for dashboard
   */
  async getRecentActivities(limit = 10) {
    return await prisma.activity.findMany({
      take: limit,
      orderBy: {createdAt: 'desc'},
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
  }
}

export const activityService = new ActivityService();
