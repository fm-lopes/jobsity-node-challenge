import UserController from '../controllers/users.controller';
import { Router, Request, Response } from 'express';
import authMiddleware from '../middlewares/auth.middleware';

class UsersRoute {
  public path = '';
  public router = Router();

  public controller = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`/register`, this.controller.registerUser); // public so we can register new users and test all endpoints
    this.router.post(`/login`, this.controller.login); // public so we can login
    this.router.post(`/reset-password`, authMiddleware(), this.controller.resetPassword);
  }
}

export default UsersRoute;
