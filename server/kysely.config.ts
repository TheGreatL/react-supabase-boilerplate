import { defineConfig } from 'kysely-ctl';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  kysely: {
    dialect: 'postgres',
    dialectConfig: {
      pool: new Pool({
        connectionString: process.env.DATABASE_URL,
      }),
    },
  },
  migrations: {
    migrationFolder: 'migrations',
  },
  codegen: {
    outType: 'src/shared/types/db.ts',
  },
});
