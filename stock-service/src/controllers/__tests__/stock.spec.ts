import App from '../../app';
import * as request from 'supertest';

const app = new App();
const server = app.getServer();

describe('StockController', () => {
  describe('Get stock quote', () => {
    test('should get quote from stooq service', async () => {

      const response = await request(server)
        .get('/stock?stockCode=aapl.us');
      expect(response.status).toBe(200);

      expect(response.body).toMatchObject({
        quote: expect.objectContaining({
          name: expect.any(String),
          symbol: expect.any(String),
          open: expect.any(Number),
          high: expect.any(Number),
          low: expect.any(Number),
          close: expect.any(Number)
        })
      })
    });
  });
});
