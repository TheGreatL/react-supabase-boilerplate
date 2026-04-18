import {type Kysely, sql} from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // 1. Drop existing tables and types to start fresh
  await db.schema.dropTable('Activity').ifExists().execute();
  await db.schema.dropTable('Session').ifExists().execute();
  await db.schema.dropTable('User').ifExists().execute();
  await sql`DROP TYPE IF EXISTS "Role"`.execute(db);

  // 2. Create Roles Table
  await db.schema
    .createTable('Roles')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('name', 'text', (col) => col.notNull().unique())
    .addColumn('description', 'text')
    .addColumn('createdAt', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updatedAt', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('deletedAt', 'timestamp')
    .execute();

  // 3. Create Permissions Table
  await db.schema
    .createTable('Permissions')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('name', 'text', (col) => col.notNull().unique())
    .addColumn('description', 'text')
    .addColumn('createdAt', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updatedAt', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('deletedAt', 'timestamp')
    .execute();

  // 4. Create Modules Table
  await db.schema
    .createTable('Modules')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('name', 'text', (col) => col.notNull().unique())
    .addColumn('description', 'text')
    .addColumn('createdAt', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updatedAt', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('deletedAt', 'timestamp')
    .execute();

  // 5. Create ModulePermissions Table
  await db.schema
    .createTable('ModulePermissions')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('moduleId', 'uuid', (col) => col.notNull().references('Modules.id').onDelete('cascade'))
    .addColumn('permissionId', 'uuid', (col) => col.notNull().references('Permissions.id').onDelete('cascade'))
    .addColumn('createdAt', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updatedAt', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('deletedAt', 'timestamp')
    .execute();

  // 6. Create RolePermissions Table
  await db.schema
    .createTable('RolePermissions')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('roleId', 'uuid', (col) => col.notNull().references('Roles.id').onDelete('cascade'))
    .addColumn('modulePermissionId', 'uuid', (col) =>
      col.notNull().references('ModulePermissions.id').onDelete('cascade')
    )
    .addColumn('createdAt', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updatedAt', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('deletedAt', 'timestamp')
    .execute();

  // 7. Create Users Table
  await db.schema
    .createTable('Users')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('firstName', 'text', (col) => col.notNull())
    .addColumn('lastName', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('password', 'text', (col) => col.notNull())
    .addColumn('profilePhoto', 'text')
    .addColumn('createdAt', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updatedAt', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('deletedAt', 'timestamp')
    .execute();

  // 8. Create UserRoles Table
  await db.schema
    .createTable('UserRoles')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('roleId', 'uuid', (col) => col.notNull().references('Roles.id').onDelete('cascade'))
    .addColumn('userId', 'uuid', (col) => col.notNull().references('Users.id').onDelete('cascade'))
    .addColumn('createdAt', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updatedAt', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('deletedAt', 'timestamp')
    .execute();

  // 9. Create ActivityLogs Table (Requested in supplement)
  await db.schema
    .createTable('ActivityLogs')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('performerId', 'uuid', (col) => col.notNull().references('Users.id').onDelete('cascade'))
    .addColumn('moduleId', 'uuid', (col) => col.notNull().references('Modules.id').onDelete('cascade'))
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('createdAt', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();

  // 10. Re-create Session Table (needed for auth logic)
  await db.schema
    .createTable('Sessions')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('userId', 'uuid', (col) => col.notNull().references('Users.id').onDelete('cascade'))
    .addColumn('refreshToken', 'text', (col) => col.notNull().unique())
    .addColumn('expiresAt', 'timestamp', (col) => col.notNull())
    .addColumn('lastLogin', 'timestamp')
    .addColumn('createdAt', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updatedAt', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('deletedAt', 'timestamp')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('Sessions').execute();
  await db.schema.dropTable('ActivityLogs').execute();
  await db.schema.dropTable('UserRoles').execute();
  await db.schema.dropTable('Users').execute();
  await db.schema.dropTable('RolePermissions').execute();
  await db.schema.dropTable('ModulePermissions').execute();
  await db.schema.dropTable('Modules').execute();
  await db.schema.dropTable('Permissions').execute();
  await db.schema.dropTable('Roles').execute();

  // Note: We don't restore old tables here as it's a "fresh and clean" schema mandate.
  // But for safety in standard migrations, you'd define the old tables here.
}
