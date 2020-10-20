import { Request, Response } from 'express';
import { User as UserType } from '../models/user';
import db from '../models';
import { sequelizeErrorHandler } from '../utils/errorHandlers';
import { RequestType } from 'global';

const { User } = db;



 
export class AuthController {
  public async register(req:  RequestType, res: Response) {
    let user: UserType;
    
    try {
      user = await User.create(req.data);
      return res.json({
        message: 'Registering the user',
        data: user,
      });

    } catch (error) {
      return res.json(sequelizeErrorHandler(error))
    }

   
  }
}
