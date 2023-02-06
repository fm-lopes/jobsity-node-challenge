import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as logger from 'morgan';
import IndexRoute from './routes/index.route';
import StockRoute from './routes/stock.route';
import errorMiddleware from './middlewares/error.middleware';

require('express-async-errors');

class App {
  public app: express.Application;
  public port: (string | number);
  public env: boolean;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3002;

    this.initializeMiddlewares();
    this.initializeErrorHandling();

    this.initializeRoutes([
      new IndexRoute(),
      new StockRoute(),
  ]);
  }

  public listen(): http.Server {
    return this.app.listen(this.port, () => {
      console.log(`🚀 App listening on the port ${this.port}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(logger('dev'));
    this.app.use(cors({ origin: true, credentials: true }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(errorMiddleware);
  }

  public initializeRoutes(routes: any[]) {
    let indexRoute = '/';

    console.log('Initializing server');
    routes.forEach((route) => {
      this.app.use(indexRoute, route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
