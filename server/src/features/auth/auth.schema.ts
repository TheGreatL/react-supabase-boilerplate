import z from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password cannot be empty').max(20, 'Exceed to the recommended password length')
});

export const authSchema = loginSchema.extend({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required')
});

export type TLogin = z.infer<typeof loginSchema>;
export type TAuthRequest = z.infer<typeof authSchema>;
