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
const tokenAdmin = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3NTY0OTQ0MCwiZXhwIjoxNjc1NzM1ODQwfQ.CtFyvmbt0GpNxOOo5qOhQfr85mWovwKJGbfG9dgEPZ4';

beforeEach(async () => {
  await initDatabase();
});

describe('StockController', () => {
  describe('Get stock quote', () => {
    test('should get quote from external service', async () => {

      await userService.registerUser('123@gmail.com', UserRole.USER);

      const response = await request(server)
        .get('/stock?q=aapl.us')
        .set('Authorization', `Bearer ${tokenUser}`);
      expect(response.status).toBe(200);

      expect(response.body).toMatchObject(
        expect.objectContaining({
          name: expect.any(String),
          symbol: expect.any(String),
          open: expect.any(Number),
          high: expect.any(Number),
          low: expect.any(Number),
          close: expect.any(Number)
        })
      )
    });
  });

  describe('Get top 5 stock quotes', () => {
    test('should not allow access to an user role', async () => {

      await userService.registerUser('123@gmail.com', UserRole.USER);

      const response = await request(server)
        .get('/stats')
        .set('Authorization', `Bearer ${tokenUser}`);

      expect(response.status).toBe(401);
    });

    test('should get top 5 stock quotes for an admin role', async () => {
      await userService.registerUser('123@gmail.com', UserRole.ADMIN);
      await Promise.all([
        stockService.getQuote('aapl.us', 1),
        stockService.getQuote('aa.us', 1),
        stockService.getQuote('aa.us', 1),
      ]);

      const response = await request(server)
        .get('/stats')
        .set('Authorization', `Bearer ${tokenAdmin}`);;
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            stock: expect.any(String),
            times_requested: expect.any(Number)
          })
        ])
      );
    });
  });
});
