import redis from "async-redis";
//eslint-disable-next-line
const uuid = require("uuid");

const uuidGenerator = uuid.v4;

const REDIS_CLIENT = redis.createClient(process.env.REDIS_HOST);
export class RedisService {
  static cacheVerificationEmail(
    verificationType: "REGISTER" | "FORGOT_PASSWORD",
    data: Record<"email" & "redirectURL", string>
  ) {
    const cacheKey = uuidGenerator();
    const key = `${verificationType}_EMAIL_${cacheKey}`;
    REDIS_CLIENT.set(key, JSON.stringify(data));

    return cacheKey;
  }

  static getCachedRegisterEmail = async (
    verificationType: "REGISTER" | "FORGOT_PASSWORD",
    key: string
  ): Promise<any> => {
    const cachedKey = `${verificationType}_EMAIL_${key}`;
    return await REDIS_CLIENT.get(cachedKey);
  };
}
