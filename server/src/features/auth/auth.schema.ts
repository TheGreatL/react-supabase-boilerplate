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
      refreshToken: z.string()
    })
  })
);

export type TLogin = z.infer<typeof loginSchema>;
export type TAuthRequest = z.infer<typeof authSchema>;
