import {describe, it, expect} from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('Global API Configuration', () => {
  it('should have the /api prefix working and returning 404 for unknown sub-routes', async () => {
    const response = await request(app).get('/api/v1-non-existent');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Resource not found');
  });

  it('should return 200 for health check under /api prefix', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
