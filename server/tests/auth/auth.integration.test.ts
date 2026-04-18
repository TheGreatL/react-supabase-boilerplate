import {describe, it, expect, beforeEach, beforeAll, afterAll, vi} from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import {db} from '../../src/shared/database/db';
import {Selectable} from 'kysely';
import {DB} from '../../src/shared/database/db.types';
import {Request, Response, NextFunction} from 'express';

// Mocking infrastructure
vi.mock('../../src/shared/middleware/csrf.middleware', () => ({
  csrfMiddleware: (_req: Request, _res: Response, next: NextFunction) => next()
}));

describe('Auth Integration', () => {
  let testUser: Selectable<DB['Users']>;
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    // Ensure no conflicting test data exists from previous failed runs
    // We do this by finding all users matching our test pattern and cleaning up their related data
    const existingTestUsers = await db.selectFrom('Users')
      .where((eb) => eb.or([
        eb('email', 'like', 'auth-int-%'),
        eb('email', 'like', 'new-%')
      ]))
      .select('id')
      .execute();
    
    const ids = existingTestUsers.map(u => u.id);

    if (ids.length > 0) {
      await db.deleteFrom('Sessions').where('userId', 'in', ids).execute();
      await db.deleteFrom('UserRoles').where('userId', 'in', ids).execute();
      await db.deleteFrom('Users').where('id', 'in', ids).execute();
    }
  });

  beforeEach(async () => {
    // Setup a clean user for these tests
    const email = `auth-int-${Date.now()}@example.com`;
    testUser = await db
      .insertInto('Users')
      .values({
        id: crypto.randomUUID(),
        email,
        password: '$2b$10$YourHashedPasswordHere', // placeholder password
        firstName: 'Auth',
        lastName: 'Integration',
        updatedAt: new Date()
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  });

  afterAll(async () => {
    if (testUser) {
      // 1. Delete sessions
      await db.deleteFrom('Sessions').where('userId', '=', testUser.id).execute();
      // 2. Delete user roles
      await db.deleteFrom('UserRoles').where('userId', '=', testUser.id).execute();
      // 3. Delete user
      await db.deleteFrom('Users').where('id', '=', testUser.id).execute();
    }
  });

  describe('POST /api/auth/login', () => {
    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({email: testUser.email, password: 'wrongPassword'});

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Auth Lifecycle', () => {
    it('should register, login, and access protected route', async () => {
      const regEmail = `new-${Date.now()}@example.com`;

      // 1. Register
      const regResponse = await request(app).post('/api/auth/register').send({
        email: regEmail,
        password: 'Password123!',
        firstName: 'New',
        lastName: 'User'
      });

      expect(regResponse.status).toBe(201);
      const newUser = regResponse.body.data.user;

      // 2. Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({email: regEmail, password: 'Password123!'});

      if (loginResponse.status !== 200) {
        console.error('Login Failed Body:', JSON.stringify(loginResponse.body, null, 2));
      }
      expect(loginResponse.status).toBe(200);
      accessToken = loginResponse.body.data.accessToken;

      // Extract refreshToken from Set-Cookie header
      const cookies = (loginResponse.headers['set-cookie'] as unknown as string[]) || [];
      const refreshCookie = cookies.find((c: string) => c.startsWith('refreshToken='));
      refreshToken = refreshCookie ? refreshCookie.split('=')[1].split(';')[0] : '';

      // 3. Access Protected Route (me)
      const meResponse = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${accessToken}`);

      expect(meResponse.status).toBe(200);
      expect(meResponse.body.data.email).toBe(regEmail);

      // 4. Refresh Token
      const refreshResponse = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', [`refreshToken=${refreshToken}`]);

      expect(refreshResponse.status).toBe(200);
      expect(refreshResponse.body.data.accessToken).toBeDefined();

      // 5. Logout
      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Cookie', [`refreshToken=${refreshToken}`]);

      expect(logoutResponse.status).toBe(200);

      // Internal cleanup for the additional user created in this lifecycle test
      await db.deleteFrom('Sessions').where('userId', '=', newUser.id).execute();
      await db.deleteFrom('UserRoles').where('userId', '=', newUser.id).execute();
      await db.deleteFrom('Users').where('id', '=', newUser.id).execute();
    });
  });
});
