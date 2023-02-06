import { Request, Response, NextFunction } from 'express';

const redisCache = require('express-redis-cache')({
  host: process.env.REDIS_HOST,
  auth_pass: process.env.REDIS_PASSWORD,
  port: 6379,
  expire: 3600, //default
});

export enum CACHE_PRIORITY {
  CRITICAL = 10,
  HIGH = 30,
  DEFAULT = 3600
}

function cacheMiddleware(priority?: CACHE_PRIORITY): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction): void => {
    const noCacheHeader = req.headers['x-cache'] === 'NO-CACHE';

    if (!noCacheHeader) {
      return redisCache.route(
        req.originalUrl, 
        priority || CACHE_PRIORITY.DEFAULT
      )(req, res, next);
    }

    return next();
  }
}

export default cacheMiddleware;
