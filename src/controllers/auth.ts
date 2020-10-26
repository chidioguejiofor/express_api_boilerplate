import { Model } from "sequelize/types";
import { Response } from "express";
import db from "../models";
import { sequelizeErrorHandler } from "../utils/errorHandlers";
import { RequestType } from "global";
import { SendGridMailService } from "../services/EmailService";
import { TokenValidator } from "../utils/TokenValidator";
import { LOGIN_SUCCESS, REGISTER_SUCCESS } from "../utils/messages/success";
import { format } from "util";
import { INVALID_LINK, NOT_FOUND } from "../utils/messages/error";
import { RedisService } from "../services/cache";

const User = db.User;

export class AuthController {
  REGISTER_MAIL = `
    Click on <a href="%s">this link </a> to confirm
  `;
  public register = async (
    req: RequestType,
    res: Response
  ): Promise<unknown> => {
    let user;

    try {
      const confirmLinkPath = `${req.protocol}://${req.hostname}/api/auth/confirm-email/%s`;
      const { redirectURL, ...userData } = req.data;
      user = await User.create({
        ...req.data,
        password: await User.generateHash(userData.password),
      });

      const email = user.getDataValue("email");
      const registerId = RedisService.cacheEmailToRegister({
        email,
        redirectURL,
      });
      const confirmLink = format(confirmLinkPath, registerId);
      const personaliseConfirmEmail = format(this.REGISTER_MAIL, confirmLink);
      const service = new SendGridMailService(
        personaliseConfirmEmail,
        "Confirm Email"
      );

      service.sendEmail(email);

      delete user.dataValues["password"];
      return res.json({
        message: REGISTER_SUCCESS,
        data: user,
      });
    } catch (error) {
      const [resJson, statusCode] = sequelizeErrorHandler(error);
      return res.status(statusCode).json(resJson);
    }
  };

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

  public async confirmEmail(req: RequestType, res: Response): Promise<unknown> {
    const confirmEmailId = req.params.id;
    const redisData = await RedisService.getCachedRegisterEmail(confirmEmailId);

    if (!redisData) {
      return res.status(400).json({
        message: INVALID_LINK,
      });
    }
    const { email, redirectURL } = JSON.parse(redisData);
    if (!email || !redirectURL) {
      return res.redirect(`${redirectURL}?message=${INVALID_LINK}`);
    }

    const [updated] = await User.update(
      {
        emailVerified: true,
      },
      {
        where: {
          email,
        },
      }
    );

    if (updated) {
      return res.redirect(`${redirectURL}?email=${email}&success=true`);
    }

    return res.redirect(`${redirectURL}?email=${email}&success=false`);
  }
}
