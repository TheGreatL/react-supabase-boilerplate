import {describe, it, expect, beforeEach, afterAll} from 'vitest';
import {RBACService} from '../../src/features/rbac/rbac.service';
import {UserRepository} from '../../src/features/user/user.repository';
import {db} from '../../src/shared/database/db';
import {Selectable} from 'kysely';
import {DB} from '../../src/shared/database/db.types';

describe('RBAC Integration', () => {
  const rbacService = new RBACService();
  const userRepository = new UserRepository();
  let testUser: Selectable<DB['Users']>;

  beforeEach(async () => {
    // 1. Create a clean test user
    const email = `test-rbac-${Date.now()}@example.com`;
    testUser = await userRepository.create({
      id: crypto.randomUUID(),
      email,
      password: 'password123',
      firstName: 'RBAC',
      lastName: 'Tester',
      updatedAt: new Date()
    }) as Selectable<DB['Users']>;
  });

  afterAll(async () => {
    // Cleanup test data
    if (testUser) {
      await db.deleteFrom('UserRoles').where('userId', '=', testUser.id).execute();
      await db.deleteFrom('Users').where('id', '=', testUser.id).execute();
    }
  });

  it('should assign a seeded role and retrieve permissions', async () => {
    // 1. Assign standard 'USER' role
    await rbacService.assignRoleToUser(testUser.id, 'USER');

    // 2. Verify roles
    const roles = await rbacService.getUserRoles(testUser.id);
    expect(roles).toContain('USER');

    // 3. Verify permissions (based on seed.ts, USER has READ on DASHBOARD and USERS)
    const permissions = await rbacService.getUserPermissions(testUser.id);
    
    const hasDashboardRead = permissions.some(
      (p) => p.module === 'DASHBOARD' && p.permission === 'READ'
    );
    const hasUsersRead = permissions.some(
      (p) => p.module === 'USERS' && p.permission === 'READ'
    );

    expect(hasDashboardRead).toBe(true);
    expect(hasUsersRead).toBe(true);
  });

  it('should throw error when assigning non-existent role', async () => {
    await expect(rbacService.assignRoleToUser(testUser.id, 'INVALID_ROLE')).rejects.toThrow(
      'Role INVALID_ROLE not found'
    );
  });
});
