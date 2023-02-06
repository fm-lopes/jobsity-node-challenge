import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import { UserRole } from '../models/user.model';
import StockController from '../controllers/stock.controller';

class StatsRoute {
  public path = '/stats';
  public router = Router();
  
  public controller = new StockController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/`, authMiddleware(UserRole.ADMIN), this.controller.getTop5Stocks);
  }
}

export default StatsRoute;