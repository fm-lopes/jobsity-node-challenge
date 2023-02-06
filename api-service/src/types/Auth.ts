import { Request } from 'express';

export interface DataStoredInToken {
  id: number;
  marketId: number;
  roles: string[]
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUserId extends Request {
  userId: number;
}
