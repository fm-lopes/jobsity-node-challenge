import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import StockController from '../controllers/stock.controller';

class StockRoute {
  public path = '/stock';
  public router = Router();
  
  public controller = new StockController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/`, authMiddleware(), this.controller.getStockQuote);
  }
}

export default StockRoute;