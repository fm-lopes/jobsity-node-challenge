import { Router } from 'express';
import StockController from '../controllers/stock.controller';
import cacheMiddleware from '../middlewares/cache.middleware';

class StockRoute {
  public path = '/stock';
  public router = Router();
  
  public controller = new StockController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/`, cacheMiddleware(), this.controller.getStockQuote);
  }
}

export default StockRoute;