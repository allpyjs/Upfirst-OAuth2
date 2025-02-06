import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import router from './routes'; // Import your routes file

const app = express();
const SECRET_KEY = "upfirst";

// Middleware and routes setup
app.use(bodyParser.json());
app.use(router);

// Unit Test Suite
describe('JWT Authentication API', () => {
  let token: string;

  // Test Token Generation
  it('should generate a token when username is provided', async () => {
    const response = await request(app)
      .post('/token')
      .send({ username: 'testuser' })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.access_token).toBeDefined();
    expect(response.body.token_type).toBe('Bearer');
    token = response.body.access_token; // Save the token for further tests
  });

  // Test Protected Route with valid token
  it('should access the protected route with a valid token', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("You accessed a protected route!");
    expect(response.body.user.username).toBe("testuser");
  });

  // Test Protected Route with no token
  it('should return 401 when no token is provided', async () => {
    const response = await request(app).get('/protected');

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Token required');
  });

  // Test Protected Route with invalid token
  it('should return 403 for an invalid token', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalid_token');

    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Invalid or expired token');
  });
});
