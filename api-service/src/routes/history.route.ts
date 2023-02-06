import UserController from '../controllers/users.controller';
import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import { UserRole } from '../models/user.model';

class HistoryRoute {
  public path = '/history';
  public router = Router();
  
  public controller = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware(), this.controller.getUserHistory);
  }
}

export default HistoryRoute;