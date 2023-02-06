/* eslint-disable @typescript-eslint/ban-types */
import { NextFunction, Request, Response } from 'express';
import HttpException from '../types/HttpException';
import { stooqService } from '../services/stooq.service';

class StockController {
  public async getStockQuote(req: Request, res: Response, next: NextFunction): Promise<void> {

      const stockCode = req.query.stockCode ? String(req.query.stockCode): '';

      if (!stockCode)
        throw new HttpException(400, 'missing param stockCode');

      const quote = await stooqService.getQuote(stockCode);
      res.status(200).json({ quote });
  }
}

export default StockController;
