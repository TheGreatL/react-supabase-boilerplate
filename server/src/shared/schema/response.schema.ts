import z from 'zod';

export const successResponseSchema = z.object({
  success: z.boolean(),
  message: z.string()
});

const paginatedMetaResponse = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean()
});

export const paginatedResponseSchema = successResponseSchema.extend({
  meta: paginatedMetaResponse
});
