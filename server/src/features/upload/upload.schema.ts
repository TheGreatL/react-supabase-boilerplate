import {extendZodWithOpenApi} from '@asteasolutions/zod-to-openapi';
import z from 'zod';
import {registry} from '../../shared/lib/openapi-registry';
import {successResponseSchema} from '../../shared/schema/response.schema';

extendZodWithOpenApi(z);

export const uploadSingleSchema = registry.register(
  'UploadSingleRequest',
  z.object({
    folder: z.string().min(1, 'Folder name cannot be empty').optional().default('general')
  }).optional()
);

export const uploadResponseSchema = registry.register(
  'UploadResponse',
  successResponseSchema.extend({
    data: z.object({
      path: z.string(),
      url: z.string(),
      mimetype: z.string(),
      size: z.number()
    })
  })
);

export type TUploadRequest = z.infer<typeof uploadSingleSchema>;

// --- OpenAPI Path Registrations ---
registry.registerPath({
  method: 'post',
  path: '/upload',
  tags: ['Upload'],
  summary: 'Upload a single file',
  security: [{bearerAuth: []}],
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: uploadSingleSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: 'File uploaded successfully',
      content: {
        'application/json': {
          schema: uploadResponseSchema
        }
      }
    }
  }
});
