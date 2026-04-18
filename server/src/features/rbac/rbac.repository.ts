import {db} from '../../shared/database/db';
import {Roles} from '../../shared/database/db.types';
import {active} from '../../shared/lib/db-utils';
import {Selectable} from 'kysely';

export class RBACRepository {
  /**
   * Fetches all permissions for a specific user across all their roles.
   */
  async getUserPermissions(userId: string): Promise<{module: string; permission: string}[]> {
    const permissions = await db
      .selectFrom('UserRoles')
      .innerJoin('Roles', 'Roles.id', 'UserRoles.roleId')
      .innerJoin('RolePermissions', 'RolePermissions.roleId', 'Roles.id')
      .innerJoin('ModulePermissions', 'ModulePermissions.id', 'RolePermissions.modulePermissionId')
      .innerJoin('Modules', 'Modules.id', 'ModulePermissions.moduleId')
      .innerJoin('Permissions', 'Permissions.id', 'ModulePermissions.permissionId')
      .select(['Modules.name as module', 'Permissions.name as permission'])
      .where('UserRoles.userId', '=', userId)
      .where('Roles.deletedAt', 'is', null)
      .where('Modules.deletedAt', 'is', null)
      .where('Permissions.deletedAt', 'is', null)
      .execute();

    return permissions as {module: string; permission: string}[];
  }

  /**
   * Fetches all roles assigned to a user.
   */
  async getUserRoles(userId: string): Promise<string[]> {
    const roles = await db
      .selectFrom('UserRoles')
      .innerJoin('Roles', 'Roles.id', 'UserRoles.roleId')
      .select('Roles.name')
      .where('UserRoles.userId', '=', userId)
      .where('Roles.deletedAt', 'is', null)
      .execute();

    return roles.map((r) => r.name);
  }

  /**
   * Assigns a role to a user.
   */
  async assignRoleToUser(userId: string, roleId: string): Promise<void> {
    await db
      .insertInto('UserRoles')
      .values({
        userId,
        roleId,
        updatedAt: new Date()
      })
      .execute();
  }

  /**
   * Finds a role by name.
   */
  async findRoleByName(name: string): Promise<Selectable<Roles> | null> {
    return (await db.selectFrom('Roles').selectAll().where('name', '=', name).where(active).executeTakeFirst()) || null;
  }
}
