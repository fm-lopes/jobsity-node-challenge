import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { ApiOperationGet, ApiPath } from 'swagger-express-ts';
import { stockService } from '../services/stock.service';
import { RequestWithUserId } from '../types/Auth';
import HttpException from '../types/HttpException';

@ApiPath({
  path: '',
  name: 'Stock Controller',
  security: { basicAuth: [] },
})
class StockController {

  @ApiOperationGet({
    path: '/stock',
    description: 'Get stock from stock-service and save query on database',
    summary: 'Get Stock with stock code',
    responses: {
      200: { description: 'Success' },
    },
    security: {
      Bearer: []
    },
  })
  public async getStockQuote(req: RequestWithUserId, res: Response): Promise<void> {

    const stockCode = req.query.q ? String(req.query.q) : '';

    if (!stockCode)
      throw new HttpException(400, 'missing param q');

    const user = await userService.getUser(req.userId);

    if (!user)
      throw new HttpException(404, `User ${req.userId} does not exist`);

    const { name, symbol, high, low, open, close } = await stockService.getQuote(stockCode, req.userId);
    res.status(200).json({ name, symbol, high, low, open, close });
  }

  @ApiOperationGet({
    path: '/stats',
    description: 'A super user (and only super users) can hit the stats endpoint, which will return the top 5 most requested stocks',
    summary: 'Top 5 most requested stocks',
    responses: {
      200: { description: 'Success' },
    },
    security: {
      Bearer: []
    },
  })
  public async getTop5Stocks(req: Request, res: Response): Promise<void> {

    const stats = await stockService.getQuoteStats();
    res.status(200).json(stats);
  }
}

export default StockController;
