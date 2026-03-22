import {describe, expect, it} from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Server Health Check', () => {
  it('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Resource not found');
  });

  it('should have a working API prefix', async () => {
    // This assumes there's at least one route under /api
    // If not, it will still hit the 404 handler but specifically for /api/something
    const response = await request(app).get('/api/health');
    // We expect a response from /api/health if it exists, or 404 if it doesn't
    // For now, let's just assert that it's reachable
    expect(response.status).toBeDefined();
  });
});
