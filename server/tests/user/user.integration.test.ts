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

describe('User Integration', () => {
  let testUser: Selectable<DB['Users']>;
  let accessToken: string;

  beforeEach(async () => {
    // 1. Setup a user with USERS:READ permissions (using 'USER' role)
    const email = `user-int-${Date.now()}@example.com`;
    const userId = crypto.randomUUID();
    
    testUser = await db.insertInto('Users').values({
      id: userId,
      email,
      password: 'hashedPassword',
      firstName: 'Int',
      lastName: 'User',
      updatedAt: new Date()
    }).returningAll().executeTakeFirstOrThrow();

    const userRole = await db.selectFrom('Roles').where('name', '=', 'USER').select('id').executeTakeFirstOrThrow();
    
    await db.insertInto('UserRoles').values({
      id: crypto.randomUUID(),
      userId: testUser.id,
      roleId: userRole.id,
      updatedAt: new Date()
    }).execute();

    accessToken = await TokenService.signAccessToken({
      id: testUser.id,
      email: testUser.email,
      roles: ['USER'],
      profilePhoto: null
    });
  });

  afterAll(async () => {
    if (testUser) {
      await db.deleteFrom('UserRoles').where('userId', '=', testUser.id).execute();
      await db.deleteFrom('Users').where('id', '=', testUser.id).execute();
    }
  });

  it('should list users when authorized', async () => {
    // Specifically search for our test user to avoid pagination issues
    const response = await request(app)
      .get(`/api/user?search=${testUser.email}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.some((u: Selectable<DB['Users']>) => u.id === testUser.id)).toBe(true);
  });

  it('should fetch own user details by ID', async () => {
    const response = await request(app)
      .get(`/api/user/${testUser.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe(testUser.email);
  });

  it('should update own profile', async () => {
    const updateData = {firstName: 'Updated', lastName: 'Name'};
    
    const response = await request(app)
      .patch('/api/user/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.data.firstName).toBe('Updated');

    // Verify in DB
    const updatedUser = await db.selectFrom('Users').where('id', '=', testUser.id).selectAll().executeTakeFirst();
    expect(updatedUser?.firstName).toBe('Updated');
  });

  it('should fail listing users without appropriate role', async () => {
     // Create token with no roles
     const guestToken = await TokenService.signAccessToken({
      id: crypto.randomUUID(),
      email: 'guest@example.com',
      roles: [],
      profilePhoto: null
    });

    const response = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${guestToken}`);

    expect(response.status).toBe(403);
  });
});
