import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import z from 'zod';
import { registry } from '../../shared/lib/openapi-registry';
import { successResponseSchema } from '../../shared/schema/response.schema';

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
