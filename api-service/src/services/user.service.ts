import Quote from "../models/quote.model";
import User, { UserRole } from "../models/user.model";
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import HttpException from "../types/HttpException";
import { sendMail } from './mail.service';

const crypto = require('crypto');

const jwtSecret = process.env.JWT_SECRET || '628f442418665082a55814f21fe1b923'; // fallback for testing purposes only

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface DataStoredInToken {
  userId: number;
  role: UserRole;
}

class UserService {

  public async registerUser(email: string, role: UserRole): Promise<User> { 

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      throw new HttpException(409, 'Email already in use');
    
    const user = {
      email,
      role,
      password: await this.generateRandomPassword()
    }

    return User.create(user);
  }

  public getUser(id: number): Promise<User> {
    return User.findByPk(id);
  }

  public async login(email: string, password: string): Promise<TokenData> {
    const user = await User.findOne({ where: { email, password } });

    if (!user)
      throw new HttpException(401, 'Invalid credentials');

    return this.createToken(user.id, user.role);
  }

  public async resetPassword(userId: number): Promise<void> {
    const user = await User.findByPk(userId);
    
    if (!user)
      throw new HttpException(404, 'User not found');

    const newPassword = await this.generateRandomPassword();

    sendMail(
      'Reset password', 
      `Your new password is ${newPassword}`,
      user.email,
      () => {
        console.log('Email sent');
        user.password = newPassword;
        return user.save();
      }
    );
  }

  private createToken(userId: number, role?: UserRole): TokenData {
    const dataStoredInToken: DataStoredInToken = {
      userId,
      role
    };
    const expiresIn: number = 60 * 60 * 24;
    const tokenJWT = jwt.sign(dataStoredInToken, jwtSecret, { expiresIn });

    return { expiresIn, token: tokenJWT };
  }

  private generateRandomPassword(): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(24, (err: Error, buffer: Buffer) => {
        if (err)
          reject(err);
        resolve(buffer.toString('hex'));
      });
    })
  }
}

export const userService = new UserService();