import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/index.js';
import { TransactionBuilder } from 'kysely';
import { brotliDecompressSync } from 'zlib';

describe('Part 1: API Integration Tests', () => {
  //it('should pass placeholder test', () => {
  
    // TODO: Student implementation - Part 1: Integration Testing
    // Test user creation (POST /users)
    it('1. Created user and ticket successfully! (201)', async () => {
      const userResponse = await request(app).post('/users').send({name: 'Garfield', email: 'Garfield@yahoo.com'});
      expect(userResponse.status).toBe(201);

      const userId = userResponse.body.id;

      const ticketResponse = await request(app).post('/tickets').set('X-User-Id', String(userId)).send({title: 'Fix bug.', description: 'Fixing bug..' });
      expect(ticketResponse.status).toBe(201);
    });

    // Test ticket creation (POST /tickets)
    it('2. Rejects POST /tickets with 401 when X-User-Id is missing...', async () => {
      const response = await request(app).post('/tickets').send({title: 'UNAUTHORIZED TICKET'});
      expect(response.status).toBe(401);
    });
    // Test auth middleware rejection (401 when X-User-Id is missing or invalid)
    it('3. Rejects POST /tickets with 401 when X-User-Id is INVALID.', async () => {
      const response = await request(app).post('/tickets').set('X-User-Id', 'invalid-id-string').send({title: 'Invalid User Test!'});
      expect(response.status).toBe(401);
    });
    // Test 404 responses for non-existent users and tickets
    it('4. Returns 404 when fetching a NON-EXISTENT user or ticket', async () => {
      const userResponse = await request(app).get('/users/9999999');
      expect(userResponse.status).toBe(404);

      const ticketRes = await request(app).get('/tickets/9999999');
      expect(ticketRes.status).toBe(404);
    });
    // Test pagination and filtering on GET /tickets
    it('5. Handles pagination AND status filtering on GET /tickets', async () => {
      const response = await request(app).get('/tickets').query({limit: 5, offset: 0, status: 'TODO'});
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    // Placeholder test...
    //expect(true).toBe(true);

  });
