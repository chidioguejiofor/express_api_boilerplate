import { NextFunction, Response } from "express";
import { RequestType } from "global";
import jwt from "jsonwebtoken";
import { RedisService } from "../services/cache";
import { format } from "util";
import { REDIS_LOGIN_TOKEN_CACHE_KEY } from "./constants";

export class TokenValidator {
  static TOKEN_SCRET = process.env.JWT_SECRET;

  static createToken(data: Record<string, string>, expiresIn: string) {
    return jwt.sign(data, this.TOKEN_SCRET, { expiresIn });
  }

  static decodeToken(token) {
    try {
      const decoded = jwt.verify(token, this.TOKEN_SCRET);
      return [true, decoded];
    } catch (err) {
      return [
        false,
        {
          message: "Session invalid, please login again",
        },
      ];
    }
  }

  static async protectRouteMiddleWare(
    req: RequestType,
    res: Response,
    next: NextFunction
  ) {
    const authorization = req.headers.authorization || "";
    const splittedAuth = authorization.split(" ");
    if (splittedAuth.length != 2 || splittedAuth[0] !== "Bearer") {
      return res.status(401).json({
        message: "You need to login in order to access this.",
      });
    }
    const [, loginId] = splittedAuth;

    const loginPattern = format(REDIS_LOGIN_TOKEN_CACHE_KEY, "*", loginId);

    const [redisLoginKey] = await RedisService.keys(loginPattern);
    if (!redisLoginKey) {
      return res.status(401).json({
        message: "Session invalid, please login again",
      });
    }
    const token = JSON.parse(await RedisService.retrieveKey(redisLoginKey));

    if (!token) {
      return res.status(401).json({
        message: "Session invalid, please login again",
      });
    }

    const [success, decodedOrError] = TokenValidator.decodeToken(token);

    if (!success) {
      return res.status(401).json({
        decodedOrError,
        message: "Session expired, please login again",
      });
    }

    req.decoded = decodedOrError;
    return next();
  }
}
