import {Kysely, PostgresDialect} from 'kysely';
import {Pool} from 'pg';
import {DB} from './db.types';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Kysely DB Client
 * This is the central database client that should be used by all repositories.
 * It uses the auto-generated types from kysely-codegen.
 */
export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
      // Maximum number of clients in the pool
      max: 10
    })
  })
});

/**
 * Export specific table names as constants to avoid magic strings
 */
export const TABLES = {
  USER: 'User',
  SESSION: 'Session',
  ACTIVITY: 'Activity'
} as const;
