import { Response } from "express";
import db from "../models";
import { sequelizeErrorHandler } from "../utils/errorHandlers";
import { RequestType } from "global";
const { User } = db;
import { SendGridMailService } from "../services/EmailService";
import { TokenValidator } from "../utils/TokenValidator";
import { LOGIN_SUCCESS, REGISTER_SUCCESS } from "../utils/messages/success";
import { format } from "util";
import { NOT_FOUND } from "../utils/messages/error";

export class AuthController {
  REGISTER_EMAIL = `
    Click on <a href="https://google.com">this link </a> to confirm
  `;
  public async register(req: RequestType, res: Response): Promise<unknown> {
    let user;

    try {
      user = await User.create({
        ...req.data,
        password: await User.generateHash(req.data.password),
      });

      const service = new SendGridMailService(
        this.REGISTER_EMAIL,
        "Confirm Email"
      );

      console.log(await service.sendEmail(user.getDataValue("email")));

      delete user["password"];
      return res.json({
        message: REGISTER_SUCCESS,
        data: user,
      });
    } catch (error) {
      const [resJson, statusCode] = sequelizeErrorHandler(error);
      return res.status(statusCode).json(resJson);
    }
  }

  public async login(req: RequestType, res: Response): Promise<unknown> {
    let user;

    try {
      const { password, email } = req.data;
      user = await User.findOne({
        where: {
          email,
        },
      });

      const passwordIsValid =
        user && (await User.isPasswordValid(password, user["password"]));

      if (passwordIsValid) {
        const data = {
          ...user.dataValues,
        };
        delete data["password"];
        const token = TokenValidator.createToken({ email }, "3d");
        return res.json({
          message: LOGIN_SUCCESS,
          data,
          token,
        });
      }
    } catch (error) {
      const [resJson, statusCode] = sequelizeErrorHandler(error);
      return res.status(statusCode).json(resJson);
    }

    return res.status(404).json({
      message: format(NOT_FOUND, "Credentials"),
    });
  }
}
