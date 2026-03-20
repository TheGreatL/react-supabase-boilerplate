import swaggerJSDoc from 'swagger-jsdoc';
import {OpenApiGeneratorV3} from '@asteasolutions/zod-to-openapi';
import {registry} from './openapi-registry';

// Import schemas to ensure they are registered
import '../../features/auth/auth.schema';
import '../../features/user/user.schema';

const generator = new OpenApiGeneratorV3(registry.definitions);
const components = generator.generateComponents();

const options: swaggerJSDoc.Options = {
  definition: {
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
    ],
    components: {
      ...components.components,
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/features/**/*.route.ts', './src/features/**/*.controller.ts']
};

export const swaggerSpec = swaggerJSDoc(options);
