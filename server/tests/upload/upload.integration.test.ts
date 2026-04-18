import {describe, it, expect, beforeEach, afterAll, vi} from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import {db} from '../../src/shared/database/db';
import {Request, Response, NextFunction} from 'express';
import {TokenService} from '../../src/shared/services/token.service';
import fs from 'fs/promises';
import {Selectable} from 'kysely';
import {DB} from '../../src/shared/database/db.types';

// Mocking infrastructure
vi.mock('../../src/shared/middleware/csrf.middleware', () => ({
  csrfMiddleware: (_req: Request, _res: Response, next: NextFunction) => next()
}));

describe('Upload Integration', () => {
  let testUser: Selectable<DB['Users']>;
  let accessToken: string;

  beforeEach(async () => {
    const email = `upload-int-${Date.now()}@example.com`;
    testUser = await db.insertInto('Users').values({
      id: crypto.randomUUID(),
      email,
      password: 'hashedPassword',
      firstName: 'Upload',
      lastName: 'Tester',
      updatedAt: new Date()
    }).returningAll().executeTakeFirstOrThrow();

    accessToken = await TokenService.signAccessToken({
      id: testUser.id,
      email: testUser.email,
      roles: ['USER'],
      profilePhoto: null
    });
  });

  afterAll(async () => {
    if (testUser) {
      await db.deleteFrom('Users').where('id', '=', testUser.id).execute();
    }
  });

  it('should upload a single image successfully', async () => {
    const dummyImage = Buffer.from('fake-image-data');
    
    const response = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', dummyImage, 'test.png');

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.path).toBeDefined();
    
    // Cleanup the uploaded file
    const filePath = response.body.data.path;
    await fs.unlink(filePath).catch(() => {});
  });

  it('should fail upload without file', async () => {
    const response = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('No file uploaded');
  });

  it('should reject unsupported file types', async () => {
    const badFile = Buffer.from('bad-excel-content');
    const response = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', badFile, 'test.xlsx');

    // Multer filter returns 400 via next(new BadRequestException(...))
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Unsupported file type');
  });
});
