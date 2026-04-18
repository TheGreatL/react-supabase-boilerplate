import {describe, it, expect, beforeEach, afterAll, vi} from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import {db} from '../../src/shared/database/db';
import {TokenService} from '../../src/shared/services/token.service';
import {Selectable} from 'kysely';
import {DB} from '../../src/shared/database/db.types';

import {Request, Response, NextFunction} from 'express';

// Mocking infrastructure
vi.mock('../../src/shared/middleware/csrf.middleware', () => ({
  csrfMiddleware: (_req: Request, _res: Response, next: NextFunction) => next()
}));

describe('Dashboard Integration', () => {
  let testUser: Selectable<DB['Users']>;
  let accessToken: string;

  beforeEach(async () => {
    // 1. Setup a user with DASHBOARD permissions
    const email = `dash-test-${Date.now()}@example.com`;
    const userId = crypto.randomUUID();
    
    testUser = await db.insertInto('Users').values({
      id: userId,
      email,
      password: 'hashedPassword',
      firstName: 'Dash',
      lastName: 'Tester',
      updatedAt: new Date()
    }).returningAll().executeTakeFirstOrThrow();

    // 2. Fetch 'USER' role ID
    const userRole = await db.selectFrom('Roles').where('name', '=', 'USER').select('id').executeTakeFirstOrThrow();
    
    // 3. Assign role
    await db.insertInto('UserRoles').values({
      id: crypto.randomUUID(),
      userId: testUser.id,
      roleId: userRole.id,
      updatedAt: new Date()
    }).execute();

    // 4. Generate JWT
    accessToken = await TokenService.signAccessToken({
      id: testUser.id,
      email: testUser.email,
      roles: ['USER'],
      profilePhoto: null
    });
  });

  afterAll(async () => {
    if (testUser) {
      await db.deleteFrom('ActivityLogs').where('performerId', '=', testUser.id).execute();
      await db.deleteFrom('UserRoles').where('userId', '=', testUser.id).execute();
      await db.deleteFrom('Users').where('id', '=', testUser.id).execute();
    }
  });

  it('should fetch real dashboard statistics from the database', async () => {
    const response = await request(app)
      .get('/api/dashboard/stats')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.totalUsers).toBeGreaterThan(0);
    expect(response.body.data).toHaveProperty('activeUsersToday');
    expect(response.body.data).toHaveProperty('growthRate');
  });

  it('should fetch recent activities (at least the ones created by current test process)', async () => {
    // Record an activity manually for this user to ensure we have data
    const dashboardModule = await db
      .selectFrom('Modules')
      .where('name', '=', 'DASHBOARD')
      .select('id')
      .executeTakeFirstOrThrow();

    await db.insertInto('ActivityLogs').values({
      id: crypto.randomUUID(),
      performerId: testUser.id,
      moduleId: dashboardModule.id,
      title: 'Dashboard accessed during test',
      createdAt: new Date()
    }).execute();

    const response = await request(app)
      .get('/api/dashboard/activities')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    
    const ourActivity = response.body.data.find((a: {performerId: string}) => a.performerId === testUser.id);
    expect(ourActivity).toBeDefined();
    expect(ourActivity.title).toBe('Dashboard accessed during test');
  });

  it('should deny access if user has no role/permissions', async () => {
    // Create use without roles
    const noRoleToken = await TokenService.signAccessToken({
      id: crypto.randomUUID(),
      email: 'none@example.com',
      roles: [],
      profilePhoto: null
    });

    const response = await request(app)
      .get('/api/dashboard/stats')
      .set('Authorization', `Bearer ${noRoleToken}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Insufficient permissions for module: DASHBOARD');
  });
});
