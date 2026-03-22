import z from 'zod';
import {paginatedResponseSchema} from '../schema/response.schema';

export type TPaginatedResponse<T> = z.infer<typeof paginatedResponseSchema> & {
  data: T;
};
