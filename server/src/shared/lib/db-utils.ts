import {Expression, SqlBool, ExpressionBuilder} from 'kysely';
import {DB} from '../database/db.types';

/**
 * Filter for non-deleted records (soft-delete)
 * Usage: .where(active)
 */
/**
 * Type constraint for models that support soft-delete
 */
export interface SoftDeletable {
  deletedAt: Date | null;
}

/**
 * Filter for non-deleted records (soft-delete)
 * Usage: .where(active)
 */
export const active = <T extends keyof DB>(eb: ExpressionBuilder<DB, T>): Expression<SqlBool> => {
  // We specify 'any' for the column name here because ExpressionBuilder
  // needs to be generic over the table, but we ensure it works for any table with deletedAt
  return eb('deletedAt' as any, 'is', null);
};

/**
 * Helper to apply soft-delete filtering to a query builder
 */
export function withActive<T extends {where: (col: any, op: 'is', val: null) => T}>(query: T): T {
  return query.where('deletedAt', 'is', null);
}

/**
 * Pagination helper
 */
export function withPagination<T extends {limit: (val: number) => T; offset: (val: number) => T}>(
  query: T,
  page: number = 1,
  limit: number = 10
): T {
  const offset = (page - 1) * limit;
  return query.limit(limit).offset(offset);
}
