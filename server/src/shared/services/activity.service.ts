import {db} from '../database/db';

/**
 * Activity Service
 * Handles recording user interactions in the database using Kysely.
 */
export class ActivityService {
  private moduleCache: Record<string, string> = {};

  /**
   * Helper to get module ID by name with basic caching
   */
  async getModuleId(moduleName: string): Promise<string | null> {
    if (this.moduleCache[moduleName]) {
      return this.moduleCache[moduleName];
    }

    const module = await db
      .selectFrom('Modules')
      .select('id')
      .where('name', '=', moduleName)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();

    if (module) {
      this.moduleCache[moduleName] = module.id;
      return module.id;
    }

    return null;
  }

  /**
   * Record a new activity log
   * Gold Standard: Call this at the end of service methods to ensure execution success.
   */
  async recordLog(performerId: string, moduleName: string, title: string, description?: string) {
    try {
      const moduleId = await this.getModuleId(moduleName);

      if (!moduleId) {
        console.warn(`Module ${moduleName} not found, skipping activity log.`);
        return;
      }

      return await db
        .insertInto('ActivityLogs')
        .values({
          id: crypto.randomUUID(),
          performerId,
          moduleId,
          title,
          description: description || null
        })
        .returningAll()
        .executeTakeFirst();
    } catch (error) {
      console.error('Failed to record activity log:', error);
      // We don't throw here to avoid failing the main request if logging fails
    }
  }

  /**
   * Get recent activities for dashboard
   */
  async getRecentActivities(limit = 10) {
    const results = await db
      .selectFrom('ActivityLogs')
      .innerJoin('Users', 'Users.id', 'ActivityLogs.performerId')
      .innerJoin('Modules', 'Modules.id', 'ActivityLogs.moduleId')
      .select([
        'ActivityLogs.id',
        'ActivityLogs.performerId',
        'ActivityLogs.title',
        'ActivityLogs.description',
        'ActivityLogs.createdAt',
        'Users.firstName as user_firstName',
        'Users.lastName as user_lastName',
        'Users.email as user_email',
        'Modules.name as module_name'
      ])
      .orderBy('ActivityLogs.createdAt', 'desc')
      .limit(limit)
      .execute();

    return results.map((row) => {
      const {user_firstName, user_lastName, user_email, module_name, ...log} = row;
      return {
        ...log,
        module: module_name,
        performer: {
          firstName: user_firstName,
          lastName: user_lastName,
          email: user_email
        }
      };
    });
  }
}

export const activityService = new ActivityService();
