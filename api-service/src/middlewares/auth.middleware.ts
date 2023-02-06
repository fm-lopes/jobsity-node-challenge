import { Request, NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { RequestWithUserId } from '../types/Auth';
import { UserRole } from '../models/user.model';
import HttpException from '../types/HttpException';

function authMiddleware(allowedRole: UserRole = UserRole.USER): (req: Request, res: Response, next: NextFunction) => void {
  return (req: RequestWithUserId, res: Response, next: NextFunction): void => {
    const authorization = req.headers.authorization ? String(req.headers.authorization) : '';

    if (authorization) {
      const secret = process.env.JWT_SECRET || '628f442418665082a55814f21fe1b923';

      try {
        const token = authorization.replace('Bearer ', '');

        const { userId, role } = jwt.verify(token, secret) as { userId: number, role: UserRole };

        if (!userId || (allowedRole === UserRole.ADMIN && role === UserRole.USER)) // for simplicity's sake since there's only user/admin
          next(new HttpException(401, 'no access'));

        req.userId = userId;
        next();
      } catch (error) {
        next(new HttpException(401, 'invalid token'));
      }
    } else {
      next(new HttpException(401, 'missing token'));
    }
  }
}

export default authMiddleware;
