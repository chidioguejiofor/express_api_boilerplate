import redis from "async-redis";
//eslint-disable-next-line
const uuid = require("uuid");

export const uuidGenerator = uuid.v4;

const REDIS_CLIENT = redis.createClient(process.env.REDIS_SERVER_URL);
export class RedisService {
  static cacheVerificationEmail(
    verificationType: "REGISTER" | "FORGOT_PASSWORD",
    data: Record<"email" & "redirectURL", string>,
    expireTime: number
  ) {
    const cacheId = uuidGenerator();
    const redisKey = `${verificationType}_EMAIL_${cacheId}`;
    RedisService.cacheData(redisKey, data, expireTime);
    return cacheId;
  }

  static delete = async (pattern: string) => {
    const deletedKeys = await RedisService.keys(pattern);
    const deletePromises = [];
    for (const deletedKey of deletedKeys) {
      deletePromises.push(REDIS_CLIENT.del(deletedKey));
    }

    return Promise.all(deletedKeys);
  };
  static getCachedRegisterEmail = async (
    verificationType: "REGISTER" | "FORGOT_PASSWORD",
    key: string
  ): Promise<any> => {
    const cachedKey = `${verificationType}_EMAIL_${key}`;
    return await REDIS_CLIENT.get(cachedKey);
  };

  static async cacheData(
    key: string,
    data: Record<string, any>,
    expireTime: number = 60 * 60 * 24
  ) {
    await REDIS_CLIENT.set(key, JSON.stringify(data));
    await REDIS_CLIENT.expire(key, expireTime);
  }

  static retrieveKey = async (key: string): Promise<any> => {
    return await REDIS_CLIENT.get(key);
  };

  static keys = async (pattern: string): Promise<any> => {
    return await REDIS_CLIENT.keys(pattern);
  };
}
