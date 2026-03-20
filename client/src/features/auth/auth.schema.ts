import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(20, 'Password is too long'),
})

export type TLogin = z.infer<typeof loginSchema>

export const registerSchema = loginSchema.extend({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
})

export type TRegister = z.infer<typeof registerSchema>
