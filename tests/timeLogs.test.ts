import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/index.js';
import { TransactionBuilder } from 'kysely';

// Imported extra data from different files to be read within this file.

describe('Part 2: Time Logs Tests', () => {
 // it('should pass placeholder test', () => {

    // TODO: Student implementation - Part 2: Time Logging Tests
    it('SHOULD create time logs & return accurate total aggregated hours.', async () => {
     
      const userResponse = await request(app).post('/users').send({name: 'Time Log User', email: 'User1@yahoo.com'});
      expect(userResponse.status).toBe(201);
     const userId = userResponse.body.id;


      const ticketResponse = await request(app).post('/tickets').set('X-User-Id', String(userId)).send({title: 'Ticket for Time Tracking.', description: 'Time log for task...' });
      expect(ticketResponse.status).toBe(201);

      let ticketId = ticketResponse.body.id;
      if (!ticketId && ticketResponse.body.ticket) {
        ticketId = ticketResponse.body.ticket.id;
      }

    // Log hours for a ticket (POST /tickets/:id/time)
    const postResolution1 = await request(app).post('/tickets/' + ticketId + '/time').set('X-User-Id', String(userId)).send({ hours: 1.5 });
    expect(postResolution1.status).toBe(201);

    // Fetch total hours for a ticket (GET /tickets/:id/time)
    const postResolution2 = await request(app).post('/tickets/' + ticketId + '/time').set('X-User-Id', String(userId)).send({ hours: 8.5 });
    expect(postResolution2.status).toBe(201);

    // Verify aggregation math
    const getResolutions = await request(app).get('/tickets/' + ticketId + '/time');

    expect(getResolutions.status).toBe(200);
    expect(getResolutions.body).toEqual({ ticket_id: ticketId, total_hours: 10});
    expect(true).toBe(true);
  });
});
