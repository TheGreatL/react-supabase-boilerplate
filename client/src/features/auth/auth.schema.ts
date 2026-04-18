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

export interface TUser {
  id: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
  permissions: string[]
  profilePhoto?: string | null
}

export interface TAuthResponse {
  accessToken: string
  user: TUser
}
