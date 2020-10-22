import { Response } from "express";
import { User as UserType } from "../models/user";
import db from "../models";
import { sequelizeErrorHandler } from "../utils/errorHandlers";
import { RequestType } from "global";
const { User } = db;

export class AuthController {
  public async register(req: RequestType, res: Response): Promise<unknown> {
    let user: UserType;

    try {
      user = await User.create({
        ...req.data,
        password: await User.generateHash(req.data.password),
      });
      return res.json({
        message: "Registering the user",
        data: user,
      });
    } catch (error) {
      const [resJson, statusCode] = sequelizeErrorHandler(error);
      return res.status(statusCode).json(resJson);
    }
  }
}
