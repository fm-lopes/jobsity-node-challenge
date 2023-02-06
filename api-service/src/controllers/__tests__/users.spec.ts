import App from '../../app';
import * as request from 'supertest';
import { userService } from '../../services/user.service';
import { UserRole } from '../../models/user.model';
import { initDatabase } from '../../models/index.model';
import { stockService } from '../../services/stock.service';

const app = new App();
const server = app.getServer();

// userId: 1
const tokenUser = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjc1NjExODM1LCJleHAiOjE2NzU2OTgyMzV9.yVEJZkwV3GdYXhJHl0_IzOlEIxdrFT77qyVIey4q92A';

beforeEach(async () => {
  await initDatabase();
});

describe('UserController', () => {
  describe('Register user', () => {
    test('should register user with randomized password', async () => {

      const response = await request(server)
        .post('/register')
        .send({ email: '123@gmail.com', role: 'user' });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(
        expect.objectContaining({
          email: '123@gmail.com',
          role: 'user',
          password: expect.any(String)
        })
      )
    });
  });

  describe('get user history', () => {
    test('should return quotes saved by one user', async () => {

      await userService.registerUser('123@gmail.com', UserRole.USER);
      await stockService.getQuote('aapl.us', 1);
      await stockService.getQuote('aapl.us', 1);

      const response = await request(server)
        .get('/history')
        .set('Authorization', `Bearer ${tokenUser}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            symbol: expect.any(String),
            open: expect.any(Number),
            high: expect.any(Number),
            low: expect.any(Number),
            close: expect.any(Number),
            date: expect.any(String)
          })
        ])
      )
    });

    describe('login', () => {
      test('should return token for valid credentials', async () => {

        const { email, password } = await userService.registerUser('123@gmail.com', UserRole.USER);

        const response = await request(server)
          .post('/login')
          .send({ email, password });;

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(
          expect.objectContaining({
            token: expect.any(String)
          })
        )
      });
    });
  });
});
