import z from 'zod';

export const loginSchema = z.object({
  email: z.email().nonempty('Email cannot be empty'),
  password: z.string().nonempty('Password cannot be empty').max(20, 'Exceed to the recommended password length')
});
export type TLogin = z.infer<typeof loginSchema>;
