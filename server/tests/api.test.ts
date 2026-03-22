import {describe, it, expect} from 'vitest';
import request from 'supertest';
import express from 'express';

// Mocking a simple app for demonstration
// In a real scenario, you would import your app from src/app.ts
const app = express();
app.get('/api/health', (req, res) => {
  res.status(200).json({status: 'ok'});
});

describe('Example Server API Test', () => {
  it('should return 200 for health check', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({status: 'ok'});
  });

  it('assertions work correctly', () => {
    expect(1 + 1).toBe(2);
  });
});
