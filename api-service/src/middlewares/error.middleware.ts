import { Request, Response, NextFunction } from 'express';
import HttpException from '../types/HttpException';

function errorMiddleware(err: HttpException, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'production' ? {} : err;

  res.status(err.status || 500);
}

export default errorMiddleware;
