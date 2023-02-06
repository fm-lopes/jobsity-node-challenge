import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { ApiOperationGet, ApiOperationPost, ApiPath } from 'swagger-express-ts';
import { stockService } from '../services/stock.service';
import { RequestWithUserId } from '../types/Auth';
import HttpException from '../types/HttpException';

@ApiPath({
  path: '',
  name: 'Users Controller'
})
class UserController {

  @ApiOperationPost({
    path: '/register',
    description: 'To register a user the API service must receive a request with an email address, user role and return a randomized password.',
    summary: 'Register a user',
    parameters: {
      body: { description: 'user data', required: true }
    },
    responses: {
      201: { description: 'Success' },
    }
  })
  public async registerUser(req: Request, res: Response): Promise<void> {
    const { email, role } = req.body;

    if (!email || !role)
      throw new HttpException(400, 'missing params');

    const user = await userService.registerUser(email, role);
    res.status(201).json(user);
  }

  @ApiOperationGet({
    path: '/history',
    description: 'Get request history for authenticated user',
    summary: 'User history',
    responses: {
      200: { description: 'Success' },
    },
    security: {
      Bearer: []
    },
  })
  public async getUserHistory(req: RequestWithUserId, res: Response) {

    const quotes = await stockService.getUserQuotes(req.userId);

    res.status(200).json(quotes.map(q => ({
      name: q.name, 
      symbol: q.symbol,
      open: q.open,
      high: q.high,
      low: q.low,
      close: q.close,
      date: q.createdAt 
    })));
  }

  @ApiOperationPost({
    path: '/login',
    description: 'Generate a jwt token based on email and password',
    summary: 'User login',
    parameters: {
      body: { description: 'user data', required: true }
    },
    responses: {
      200: { description: 'Success' },
    }
  })
  public async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password)
      throw new HttpException(400, 'missing params');

    const token = await userService.login(email, password);

    res.status(200).json(token);
  }

  @ApiOperationPost({
    path: '/reset-password',
    description: 'Send an email with new user password',
    summary: 'Reset user password',
    parameters: {
      body: { description: 'user data', required: true }
    },
    responses: {
      200: { description: 'Success' },
    }
  })
  public async resetPassword(req: RequestWithUserId, res: Response): Promise<void> {

    await userService.resetPassword(req.userId);

    res.status(200).json({ message: 'email sent' });
  }
}

export default UserController;
