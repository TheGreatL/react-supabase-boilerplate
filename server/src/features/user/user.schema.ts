import z from 'zod';
import {registry} from '../../shared/lib/openapi-registry';
import {paginatedResponseSchema} from '../../shared/schema/response.schema';

export const userSchema = registry.register(
  'CreateUserRequest',
  z.object({
    id: z.uuid(),
    email: z.email(),
    firstName: z.string(),
    lastName: z.string(),
    role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']),
    createdAt: z.date(),
    updatedAt: z.date()
  })
);

export const userPaginatedResponseSchema = registry.register(
  'UserPaginatedResponse',
  paginatedResponseSchema.extend({
    data: z.array(userSchema)
  })
);
