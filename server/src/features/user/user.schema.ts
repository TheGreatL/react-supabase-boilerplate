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
    roles: z.array(z.string()),
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

export const userByIdParamsSchema = registry.register(
  'UserByIdParams',
  z.object({
    id: z.string().uuid('Invalid user ID format')
  })
);

export const updateProfileSchema = registry.register(
  'UpdateProfileRequest',
  z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    email: z.string().email().optional()
  })
);

export type TUpdateProfile = z.infer<typeof updateProfileSchema>;

// --- OpenAPI Path Registrations ---
registry.registerPath({
  method: 'get',
  path: '/user',
  tags: ['User'],
  summary: 'Get all users',
  security: [{bearerAuth: []}],
  responses: {
    200: {
      description: 'List of users',
      content: {'application/json': {schema: userPaginatedResponseSchema}}
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/user/{id}',
  tags: ['User'],
  summary: 'Get user by ID',
  security: [{bearerAuth: []}],
  request: {
    params: userByIdParamsSchema
  },
  responses: {
    200: {
      description: 'User details',
      content: {'application/json': {schema: userSchema}}
    }
  }
});

registry.registerPath({
  method: 'patch',
  path: '/user/profile',
  tags: ['User'],
  summary: 'Update current user profile',
  security: [{bearerAuth: []}],
  request: {
    body: {
      content: {
        'application/json': {
          schema: updateProfileSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Profile updated successfully',
      content: {'application/json': {schema: userSchema}}
    }
  }
});

registry.registerPath({
  method: 'patch',
  path: '/user/profile/photo',
  tags: ['User'],
  summary: 'Update current user profile photo',
  security: [{bearerAuth: []}],
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: z.object({
            photo: z.string().openapi({type: 'string', format: 'binary'})
          })
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Profile photo updated successfully',
      content: {'application/json': {schema: userSchema}}
    }
  }
});
