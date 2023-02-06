import { Router, Request, Response } from 'express';

class IndexRoute {
  public path = '/';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /* GET home page. */
    this.router.get(`${this.path}`, (req: Request, res: Response) => {
      res.json({ title: 'OK' });
    });
  }
}

export default IndexRoute;
