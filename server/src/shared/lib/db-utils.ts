import { Expression, SqlBool } from 'kysely';

/**
 * Filter for non-deleted records (soft-delete)
 * Usage: .where(active)
 */
export const active = (eb: any): Expression<SqlBool> => {
  return eb('deletedAt', 'is', null);
};

/**
 * Helper to apply soft-delete filtering to a query builder
 * Usage: withActive(db.selectFrom('User')).selectAll().execute()
 */
export function withActive<T extends { where: Function }>(query: T): T {
  return query.where('deletedAt', 'is', null) as T;
}

/**
 * Pagination helper
 */
export function withPagination<T extends { limit: Function, offset: Function }>(
  query: T,
  page: number = 1,
  limit: number = 10
): T {
  const offset = (page - 1) * limit;
  return query.limit(limit).offset(offset) as T;
}
