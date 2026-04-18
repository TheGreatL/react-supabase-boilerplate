import {OpenApiGeneratorV3} from '@asteasolutions/zod-to-openapi';
import {registry} from './openapi-registry';

// Import schemas to ensure they are registered (must come after registry creation)
import '../../features/auth/auth.schema';
import '../../features/user/user.schema';
import '../../features/dashboard/dashboard.schema';
import '../../features/upload/upload.schema';
import '../../features/health/health.schema';

const generator = new OpenApiGeneratorV3(registry.definitions);

export const swaggerSpec = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: 'Boilerplate API',
    version: '1.0.0',
    description: 'API documentation for the generic Boilerplate Project'
  },
  servers: [
    {
      url: '/api',
      description: 'Development server'
    }
  ]
});
