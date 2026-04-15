import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

/**
 * T3 Env configuration
 * Validates environment variables at runtime/build-time.
 */
export const env = createEnv({
  clientPrefix: 'VITE_',
  client: {
    VITE_BASE_URL: z.string().describe('VITE_BASE_URL must be a valid root URL (e.g. http://localhost:5173)'),
    VITE_API_URL: z.string().describe('VITE_API_URL can be a relative path (e.g. /api) or absolute URL'),
    VITE_BASE_URL_MEDIA: z.string().optional(),
    VITE_APP_TITLE: z.string().default('React Supabase Boilerplate'),
  },
  /**
   * What object to scan for environment variables.
   * In Vite, this is import.meta.env.
   */
  runtimeEnv: import.meta.env,
  /**
   * By default, this library will throw an error if any variables are invalid.
   */
  emptyStringAsUndefined: true,
})

const CONFIG = {
  BASE_URL: env.VITE_BASE_URL,
  API_URL: env.VITE_API_URL,
  BASE_URL_MEDIA: env.VITE_BASE_URL_MEDIA,
  TITLE: env.VITE_APP_TITLE,
}

export default CONFIG
