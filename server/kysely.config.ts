import {defineConfig} from 'kysely-ctl';
import {Kysely, PostgresDialect} from 'kysely';
import {Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  kysely: new Kysely<any>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.DATABASE_URL
      })
    })
  }),
  migrations: {
    migrationFolder: 'src/shared/database/migrations'
  },
  codegen: {
    outType: 'src/shared/database/db.types.ts'
  }
});
