import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as logger from 'morgan';
import HistoryRoute from './routes/history.route';
import IndexRoute from './routes/index.route';
import StatsRoute from './routes/stats.route';
import StockRoute from './routes/stock.route';
import UsersRoute from './routes/users.route';
import errorMiddleware from './middlewares/error.middleware';
import { initDatabase } from './models/index.model';
import * as swagger from 'swagger-express-ts';
import { SwaggerDefinitionConstant } from 'swagger-express-ts';

require('express-async-errors');

class App {
  public app: express.Application;
  public port: (string | number);
  public env: boolean;

  constructor() {
    this.setup();
  }

  public async setup() {
    this.app = express();
    this.port = process.env.PORT || 3001;

    this.initializeMiddlewares();
    this.initializeErrorHandling();
    this.initializeSwagger();

    this.initializeRoutes([
      new IndexRoute(),
      new StockRoute(),
      new UsersRoute(),
      new HistoryRoute(),
      new StatsRoute()
    ]);
    
    await initDatabase();
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

  private initializeRoutes(routes: any[]) {
    let indexRoute = '/';

    console.log('Initializing server');
    routes.forEach((route) => {
      this.app.use(indexRoute, route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeSwagger() {
    this.app.use('/api-docs/swagger', express.static('swagger'));
    this.app.use('/api-docs/swagger/assets', express.static('node_modules/swagger-ui-dist'));
    this.app.use(swagger.express(
      {
        definition: {
          info: {
            title: 'Jobsity Node Challenge',
            version: '1.0',
          },
          externalDocs: {
            url: process.env.BASE_URL || 'http://localhost:' + process.env.PORT,
          },
          // models: dtos,
          securityDefinitions: {
            bearerAuth: {
              type: SwaggerDefinitionConstant.Security.Type.API_KEY,
              name: 'Authorization',
              in: 'header'
            }
          }
        },
      },
    ));
  }
}

export default App;
