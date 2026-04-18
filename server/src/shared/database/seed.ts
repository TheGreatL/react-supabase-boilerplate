import {Kysely, PostgresDialect, Selectable, Insertable} from 'kysely';
import {Pool} from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import {DB, Modules, Permissions, ModulePermissions} from './db.types';

dotenv.config();

async function seed() {
  const db = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.DATABASE_URL
      })
    })
  });

  try {
    console.log('🌱 Starting database seeding (RBAC)...');

    const now = new Date();
    const password = await bcrypt.hash('password123', 10);

    // 1. Seed Modules
    const modules = [
      {id: crypto.randomUUID(), name: 'USERS', description: 'User Management Module', updatedAt: now},
      {id: crypto.randomUUID(), name: 'ROLES', description: 'Role & Permission Management Module', updatedAt: now},
      {id: crypto.randomUUID(), name: 'DASHBOARD', description: 'Main Dashboard Module', updatedAt: now},
      {id: crypto.randomUUID(), name: 'AUTH', description: 'Authentication Module', updatedAt: now}
    ];

    for (const m of modules) {
      await db
        .insertInto('Modules')
        .values(m)
        .onConflict((oc) => oc.column('name').doUpdateSet({updatedAt: now}))
        .execute();
    }
    console.log('✅ Seeded Modules');

    // 2. Seed Permissions
    const permissions = [
      {id: crypto.randomUUID(), name: 'READ', description: 'Read access', updatedAt: now},
      {id: crypto.randomUUID(), name: 'CREATE', description: 'Create access', updatedAt: now},
      {id: crypto.randomUUID(), name: 'UPDATE', description: 'Update access', updatedAt: now},
      {id: crypto.randomUUID(), name: 'DELETE', description: 'Delete access', updatedAt: now}
    ];

    for (const p of permissions) {
      await db
        .insertInto('Permissions')
        .values(p)
        .onConflict((oc) => oc.column('name').doUpdateSet({updatedAt: now}))
        .execute();
    }
    console.log('✅ Seeded Permissions');

    // Fetch inserted IDs to link them
    const allModules: Selectable<Modules>[] = await db.selectFrom('Modules').selectAll().execute();
    const allPermissions: Selectable<Permissions>[] = await db.selectFrom('Permissions').selectAll().execute();

    // 3. Seed ModulePermissions (Cross-join for now to give every module every permission capability)
    const modulePermissions: Insertable<ModulePermissions>[] = [];
    for (const m of allModules) {
      for (const p of allPermissions) {
        modulePermissions.push({
          id: crypto.randomUUID(),
          moduleId: m.id,
          permissionId: p.id,
          updatedAt: now
        });
      }
    }

    for (const mp of modulePermissions) {
      // Check existence to avoid unique constraint on (moduleId, permissionId) if added later
      const exists = await db
        .selectFrom('ModulePermissions')
        .where('moduleId', '=', mp.moduleId!)
        .where('permissionId', '=', mp.permissionId!)
        .executeTakeFirst();

      if (!exists) {
        await db.insertInto('ModulePermissions').values(mp).execute();
      }
    }
    console.log('✅ Seeded ModulePermissions');

    // 4. Seed Roles
    const roles = [
      {id: crypto.randomUUID(), name: 'SUPER_ADMIN', description: 'Full system access', updatedAt: now},
      {id: crypto.randomUUID(), name: 'USER', description: 'Standard user access', updatedAt: now}
    ];

    for (const r of roles) {
      await db
        .insertInto('Roles')
        .values(r)
        .onConflict((oc) => oc.column('name').doUpdateSet({updatedAt: now}))
        .execute();
    }
    console.log('✅ Seeded Roles');

    // Fetch Roles and ModulePermissions
    const superAdminRole = await db
      .selectFrom('Roles')
      .where('name', '=', 'SUPER_ADMIN')
      .selectAll()
      .executeTakeFirstOrThrow();
    const userRole = await db.selectFrom('Roles').where('name', '=', 'USER').selectAll().executeTakeFirstOrThrow();
    const allMP = await db.selectFrom('ModulePermissions').selectAll().execute();

    // 5. Seed RolePermissions
    // SUPER_ADMIN gets everything
    for (const mp of allMP) {
      const exists = await db
        .selectFrom('RolePermissions')
        .where('roleId', '=', superAdminRole.id)
        .where('modulePermissionId', '=', mp.id)
        .executeTakeFirst();

      if (!exists) {
        await db
          .insertInto('RolePermissions')
          .values({
            id: crypto.randomUUID(),
            roleId: superAdminRole.id,
            modulePermissionId: mp.id,
            updatedAt: now
          })
          .execute();
      }
    }

    // USER gets READ on DASHBOARD and USERS
    const readPermission = allPermissions.find((p) => p.name === 'READ')!;
    const dashboardModule = allModules.find((m) => m.name === 'DASHBOARD')!;
    const userModule = allModules.find((m) => m.name === 'USERS')!;

    const userMP = allMP.filter(
      (mp) =>
        mp.permissionId === readPermission.id && (mp.moduleId === dashboardModule.id || mp.moduleId === userModule.id)
    );

    for (const mp of userMP) {
      const exists = await db
        .selectFrom('RolePermissions')
        .where('roleId', '=', userRole.id)
        .where('modulePermissionId', '=', mp.id)
        .executeTakeFirst();

      if (!exists) {
        await db
          .insertInto('RolePermissions')
          .values({
            id: crypto.randomUUID(),
            roleId: userRole.id,
            modulePermissionId: mp.id,
            updatedAt: now
          })
          .execute();
      }
    }
    console.log('✅ Seeded RolePermissions');

    // 6. Seed Admin User
    const adminEmail = 'admin@example.com';
    let admin = await db.selectFrom('Users').selectAll().where('email', '=', adminEmail).executeTakeFirst();

    if (!admin) {
      admin = await db
        .insertInto('Users')
        .values({
          id: crypto.randomUUID(),
          email: adminEmail,
          password,
          firstName: 'System',
          lastName: 'Admin',
          updatedAt: now
        })
        .returningAll()
        .executeTakeFirstOrThrow();
      console.log('✅ Created Admin User');
    }

    // Assign SUPER_ADMIN role to Admin
    const adminRoleExists = await db
      .selectFrom('UserRoles')
      .where('userId', '=', admin.id)
      .where('roleId', '=', superAdminRole.id)
      .executeTakeFirst();

    if (!adminRoleExists) {
      await db
        .insertInto('UserRoles')
        .values({
          id: crypto.randomUUID(),
          userId: admin.id,
          roleId: superAdminRole.id,
          updatedAt: now
        })
        .execute();
      console.log('✅ Assigned SUPER_ADMIN role to Admin');
    }

    console.log('✅ RBAC Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

seed();
