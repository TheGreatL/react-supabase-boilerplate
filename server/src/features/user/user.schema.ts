import z from 'zod';
import {registry} from '../../shared/lib/openapi-registry';

export const userSchema = registry.register(
  'User',
  z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']),
    createdAt: z.date(),
    updatedAt: z.date()
  })
);

export const userPaginatedResponseSchema = registry.register(
  'UserPaginatedResponse',
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(userSchema),
    meta: z.object({
      total: z.number(),
      page: z.number(),
      limit: z.number(),
      totalPages: z.number(),
      hasNextPage: z.boolean(),
      hasPrevPage: z.boolean()
    })
  })
);
