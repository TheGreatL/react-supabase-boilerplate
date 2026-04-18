import {extendZodWithOpenApi} from '@asteasolutions/zod-to-openapi';
import z from 'zod';
import {registry} from '../../shared/lib/openapi-registry';
import {successResponseSchema} from '../../shared/schema/response.schema';

extendZodWithOpenApi(z);

export const dashboardStatsSchema = registry.register(
  'DashboardStats',
  successResponseSchema.extend({
    data: z.object({
      totalUsers: z.number(),
      totalActivities: z.number(),
      activeUsersToday: z.number(),
      growthRate: z.string()
    })
  })
);

export const activitySchema = z.object({
  id: z.string(),
  action: z.string(),
  createdAt: z.date().or(z.string()),
  user: z.object({
    id: z.string(),
    email: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional()
  })
});

export const dashboardActivitiesSchema = registry.register(
  'DashboardActivities',
  successResponseSchema.extend({
    data: z.array(activitySchema)
  })
);

// --- OpenAPI Path Registrations ---
registry.registerPath({
  method: 'get',
  path: '/dashboard/stats',
  tags: ['Dashboard'],
  summary: 'Get dashboard statistics',
  security: [{bearerAuth: []}],
  responses: {
    200: {
      description: 'Dashboard statistics retrieved',
      content: {'application/json': {schema: dashboardStatsSchema}}
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/dashboard/activities',
  tags: ['Dashboard'],
  summary: 'Get recent activities',
  security: [{bearerAuth: []}],
  responses: {
    200: {
      description: 'Recent activities retrieved',
      content: {'application/json': {schema: dashboardActivitiesSchema}}
    }
  }
});
