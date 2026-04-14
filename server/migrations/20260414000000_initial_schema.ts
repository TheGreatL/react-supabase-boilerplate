import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // 1. Create Role Enum
  await sql`CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN')`.execute(db);

  // 2. Create User Table
  await db.schema
    .createTable('User')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('password', 'text', (col) => col.notNull())
    .addColumn('firstName', 'text', (col) => col.notNull())
    .addColumn('lastName', 'text', (col) => col.notNull())
    .addColumn('avatar', 'text', (col) => col.defaultTo('test'))
    .addColumn('role', sql`"Role"`, (col) => col.notNull().defaultTo('USER'))
    .addColumn('createdAt', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updatedAt', 'timestamp', (col) => col.notNull())
    .addColumn('deletedAt', 'timestamp')
    .execute();

  // 3. Create Session Table
  await db.schema
    .createTable('Session')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('userId', 'text', (col) => 
      col.notNull().references('User.id').onDelete('cascade').onUpdate('cascade')
    )
    .addColumn('refreshToken', 'text', (col) => col.notNull().unique())
    .addColumn('expiresAt', 'timestamp', (col) => col.notNull())
    .addColumn('lastLogin', 'timestamp')
    .addColumn('createdAt', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updatedAt', 'timestamp', (col) => col.notNull())
    .addColumn('deletedAt', 'timestamp')
    .execute();

  // 4. Create Activity Table
  await db.schema
    .createTable('Activity')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('userId', 'text', (col) => 
      col.notNull().references('User.id').onDelete('cascade')
    )
    .addColumn('type', 'text', (col) => col.notNull())
    .addColumn('action', 'text', (col) => col.notNull())
    .addColumn('metadata', 'jsonb')
    .addColumn('createdAt', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();

  // 5. Create Indexes
  await db.schema
    .createIndex('Activity_userId_idx')
    .on('Activity')
    .column('userId')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('Activity_userId_idx').execute();
  await db.schema.dropTable('Activity').execute();
  await db.schema.dropTable('Session').execute();
  await db.schema.dropTable('User').execute();
  await sql`DROP TYPE "Role"`.execute(db);
}
