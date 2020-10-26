import { Response } from "express";
import db from "../models";
import { sequelizeErrorHandler } from "../utils/errorHandlers";
import { RequestType } from "global";
import { SendGridMailService } from "../services/EmailService";
import { TokenValidator } from "../utils/TokenValidator";
import { LOGIN_SUCCESS, REGISTER_SUCCESS } from "../utils/messages/success";
import { format } from "util";
import {
  INVALID_LINK,
  INVALID_RESET_ID,
  NOT_FOUND,
} from "../utils/messages/error";
import { RedisService } from "../services/cache";

const User = db.User;

export class AuthController {
  REGISTER_MAIL = `
    Click on <a href="%s">this link </a> to confirm
  `;

  FORGOT_MAIL = `
  Click on <a href="%s">this link </a> to reset password
`;

  public sendVerificationEmail = async (
    req: RequestType,
    type: "REGISTER" | "FORGOT_PASSWORD"
  ): Promise<void> => {
    const { redirectURL, email } = req.data;
    const baseRedirectPath = `${req.protocol}://${req.hostname}/api/auth`;
    const mapper = {
      REGISTER: {
        html: this.REGISTER_MAIL,
        subject: "Confirm Email",
        link: `${baseRedirectPath}/confirm-email/%s`,
      },
      FORGOT_PASSWORD: {
        html: this.FORGOT_MAIL,
        subject: "Change your password",
        link: `${redirectURL}/%s`,
      },
    };

    const { html, subject, link } = mapper[type];
    const registerId = RedisService.cacheVerificationEmail(type, {
      email,
      redirectURL,
    });

    const confirmLink = format(link, registerId);
    const personaliseConfirmEmail = format(html, confirmLink);
    const service = new SendGridMailService(personaliseConfirmEmail, subject);
    service.sendEmail(email);
  };

  public register = async (
    req: RequestType,
    res: Response
  ): Promise<unknown> => {
    let user;

    try {
      const { redirectURL, ...userData } = req.data;
      user = await User.create({
        ...req.data,
        password: await User.generateHash(userData.password),
      });

      this.sendVerificationEmail(req, "REGISTER");

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
    const redisData = await RedisService.getCachedRegisterEmail(
      "REGISTER",
      confirmEmailId
    );

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

  forgotPassword = async (
    req: RequestType,
    res: Response
  ): Promise<unknown> => {
    try {
      const { email } = req.data;

      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({
          message: format(NOT_FOUND, "Email"),
        });
      }

      this.sendVerificationEmail(req, "FORGOT_PASSWORD");

      return res.status(201).json({
        message: `Reset instructions has been sent to ${email}`,
      });
    } catch (error) {
      const [resJson, statusCode] = sequelizeErrorHandler(error);
      return res.status(statusCode).json(resJson);
    }
  };

  changeForgottenPassword = async (
    req: RequestType,
    res: Response
  ): Promise<unknown> => {
    try {
      const confirmEmailId = req.data.resetId;
      const redisData = await RedisService.getCachedRegisterEmail(
        "FORGOT_PASSWORD",
        confirmEmailId
      );

      if (!redisData) {
        return res.status(404).json({
          message: INVALID_RESET_ID,
        });
      }

      const { email } = JSON.parse(redisData);
      if (!email) {
        return res.status(404).json({
          message: INVALID_RESET_ID,
        });
      }
      const { password } = req.data;
      await User.update(
        {
          password: await User.generateHash(password),
        },
        {
          where: {
            email,
          },
        }
      );

      return res.status(201).json({
        message: "Password updated successfully",
      });
    } catch (error) {
      const [resJson, statusCode] = sequelizeErrorHandler(error);
      return res.status(statusCode).json(resJson);
    }
  };
}
