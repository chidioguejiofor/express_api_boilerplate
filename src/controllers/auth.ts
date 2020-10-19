import { Request, Response } from 'express';
import { User as UserType } from '../models/user';
import db from '../models';

const { User } = db;

export class AuthController {
  public async register(req: Request, res: Response) {
    let user: UserType;
    try {
      user = await User.create({
        name: 'John',
        email: 'email@email.com',
      });
    } catch (error) {
      console.log(error);
    }

    return res.json({
      message: 'Registering the user',
      data: user,
    });
  }
}
