import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(20, 'Password is too long'),
})

export type TLogin = z.infer<typeof loginSchema>
