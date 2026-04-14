import {extendZodWithOpenApi} from '@asteasolutions/zod-to-openapi';
import z from 'zod';
import {registry} from '../../shared/lib/openapi-registry';
import {successResponseSchema} from '../../shared/schema/response.schema';

extendZodWithOpenApi(z);

export const loginSchema = registry.register(
  'LoginRequest',
  z.object({
    email: z.email('Please enter a valid email address'),
    password: z.string().min(1, 'Password cannot be empty').max(20, 'Exceed to the recommended password length')
  })
);

export const authSchema = registry.register(
  'RegisterRequest',
  loginSchema.extend({
    firstName: z.string().nonempty('First name is required'),
    lastName: z.string().nonempty('Last name is required')
  })
);

export const authResponseSchema = registry.register(
  'AuthResponse',
  successResponseSchema.extend({
    data: z.object({
      accessToken: z.string(),
      user: z.object({
        id: z.string(),
        email: z.string().email(),
        firstName: z.string(),
        lastName: z.string(),
        role: z.string()
      })
    })
  })
);

export const csrfResponseSchema = registry.register(
  'CsrfResponse',
  successResponseSchema.extend({
    data: z.object({initialized: z.boolean()})
  })
);

export type TLogin = z.infer<typeof loginSchema>;
export type TAuthRequest = z.infer<typeof authSchema>;
export type TAuthResponse = z.infer<typeof authResponseSchema>;

// --- OpenAPI Path Registrations ---
registry.registerPath({
  method: 'post',
  path: '/auth/login',
  tags: ['Auth'],
  summary: 'Login to the application',
  request: {
    body: {content: {'application/json': {schema: loginSchema}}}
  },
  responses: {
    200: {description: 'Login successful', content: {'application/json': {schema: authResponseSchema}}},
    401: {description: 'Invalid credentials'}
  }
});

registry.registerPath({
  method: 'post',
  path: '/auth/register',
  tags: ['Auth'],
  summary: 'Register a new user',
  request: {
    body: {content: {'application/json': {schema: authSchema}}}
  },
  responses: {
    201: {description: 'Registration successful', content: {'application/json': {schema: authResponseSchema}}},
    400: {description: 'User already exists'}
  }
});

registry.registerPath({
  method: 'post',
  path: '/auth/refresh',
  tags: ['Auth'],
  summary: 'Refresh access token (uses httpOnly refreshToken cookie)',
  responses: {
    200: {description: 'Token refreshed', content: {'application/json': {schema: successResponseSchema.extend({data: z.object({accessToken: z.string()})})}}},
    401: {description: 'Refresh token required or invalid'}
  }
});

registry.registerPath({
  method: 'post',
  path: '/auth/logout',
  tags: ['Auth'],
  summary: 'Logout from the application',
  responses: {
    200: {description: 'Logged out successfully'}
  }
});

registry.registerPath({
  method: 'get',
  path: '/auth/me',
  tags: ['Auth'],
  summary: 'Get current authenticated user profile',
  security: [{bearerAuth: []}],
  responses: {
    200: {description: 'User profile retrieved'},
    401: {description: 'Unauthorized'}
  }
});

registry.registerPath({
  method: 'get',
  path: '/auth/csrf',
  tags: ['Auth'],
  summary: 'Initialize CSRF token cookie (call on app startup)',
  responses: {
    200: {description: 'CSRF token set', content: {'application/json': {schema: csrfResponseSchema}}}
  }
});
