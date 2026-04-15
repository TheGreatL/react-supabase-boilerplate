import { z } from 'zod'

const envSchema = z.object({
  VITE_BASE_URL: z.string().url('VITE_BASE_URL must be a valid URL'),
  VITE_API_URL: z.string().url('VITE_API_URL must be a valid URL'),
  VITE_BASE_URL_MEDIA: z.string().url().optional(),
  VITE_APP_TITLE: z.string().default('React Supabase Boilerplate'),
})

const _env = envSchema.safeParse(import.meta.env)

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format())
  throw new Error('Invalid environment variables')
}

const config = _env.data

const CONFIG = {
  BASE_URL: config.VITE_BASE_URL,
  API_URL: config.VITE_API_URL,
  BASE_URL_MEDIA: config.VITE_BASE_URL_MEDIA,
  TITLE: config.VITE_APP_TITLE,
}

export default CONFIG
