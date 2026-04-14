import {db} from '../database/db';

export enum ActivityType {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  PROFILE_UPDATE = 'PROFILE_UPDATE',
  LOGOUT = 'LOGOUT'
}

/**
 * Activity Service
 * Handles recording user interactions in the database using Kysely.
 */
export class ActivityService {
  /**
   * Record a new activity
   */
  async recordActivity(userId: string, type: ActivityType, action: string, metadata?: any) {
    try {
      return await db
        .insertInto('Activity')
        .values({
          id: crypto.randomUUID(),
          userId,
          type,
          action,
          metadata: metadata || {}
        })
        .returningAll()
        .executeTakeFirst();
    } catch (error) {
      console.error('Failed to record activity:', error);
      // We don't throw here to avoid failing the main request if logging fails
    }
  }

  /**
   * Get recent activities for dashboard
   */
  async getRecentActivities(limit = 10) {
    const results = await db
      .selectFrom('Activity')
      .innerJoin('User', 'User.id', 'Activity.userId')
      .selectAll('Activity')
      .select(['User.firstName as user_firstName', 'User.lastName as user_lastName', 'User.email as user_email'])
      .orderBy('Activity.createdAt', 'desc')
      .limit(limit)
      .execute();

    // Map to nested structure for compatibility
    return results.map((row) => {
      const {user_firstName, user_lastName, user_email, ...activity} = row;
      return {
        ...activity,
        user: {
          firstName: user_firstName,
          lastName: user_lastName,
          email: user_email
        }
      };
    });
  }
}

export const activityService = new ActivityService();
