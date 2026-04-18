import {extendZodWithOpenApi} from '@asteasolutions/zod-to-openapi';
import z from 'zod';
import {registry} from '../../shared/lib/openapi-registry';

extendZodWithOpenApi(z);

export const healthResponseSchema = registry.register(
  'HealthResponse',
  z.object({
    success: z.boolean(),
    status: z.string(),
    services: z.object({
      api: z.string(),
      database: z.string()
    }),
    timestamp: z.string()
  })
);

// --- OpenAPI Path Registrations ---
registry.registerPath({
  method: 'get',
  path: '/health',
  tags: ['Health'],
  summary: 'Check API and Database health',
  responses: {
    200: {
      description: 'API is healthy',
      content: {'application/json': {schema: healthResponseSchema}}
    },
    503: {
      description: 'API is degraded',
      content: {'application/json': {schema: healthResponseSchema}}
    }
  }
});
