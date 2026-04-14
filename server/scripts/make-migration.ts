/**
 * Usage: npm run db:make <migration_name>
 * Example: npm run db:make add_posts_table
 *
 * Creates a new timestamped migration file in:
 *   src/shared/database/migrations/<timestamp>_<name>.ts
 */

import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const name = process.argv[2];

if (!name) {
  console.error('❌ Migration name is required.');
  console.error('   Usage: npm run db:make <migration_name>');
  console.error('   Example: npm run db:make add_posts_table');
  process.exit(1);
}

// Sanitize: lowercase, replace spaces/hyphens with underscores
const safeName = name.trim().toLowerCase().replace(/[\s-]+/g, '_');

// Timestamp: YYYYMMDDHHmmss
const now = new Date();
const pad = (n: number) => String(n).padStart(2, '0');
const timestamp =
  `${now.getFullYear()}` +
  `${pad(now.getMonth() + 1)}` +
  `${pad(now.getDate())}` +
  `${pad(now.getHours())}` +
  `${pad(now.getMinutes())}` +
  `${pad(now.getSeconds())}`;

const filename = `${timestamp}_${safeName}.ts`;
const migrationsDir = path.resolve(__dirname, '../src/shared/database/migrations');
const outputPath = path.join(migrationsDir, filename);

const template = `import {type Kysely, sql} from 'kysely';
import {DB} from '../db.types';

export async function up(db: Kysely<DB>): Promise<void> {
  // TODO: implement migration
}

export async function down(db: Kysely<DB>): Promise<void> {
  // TODO: implement rollback
}
`;

fs.mkdirSync(migrationsDir, {recursive: true});
fs.writeFileSync(outputPath, template, 'utf-8');

console.log(`✅ Migration created: src/shared/database/migrations/${filename}`);
