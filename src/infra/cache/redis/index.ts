import { env } from "@/infra/environment";
import { Redis } from "ioredis";
import { RedisCacheRepository } from "./redis-cache-repository";

export class RedisService extends Redis {
  constructor() {
    super({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD,
      db: env.REDIS_DB,
    });
  }
}

const redisService = new RedisService();
const redis = new RedisCacheRepository(redisService);

export { redisService, redis };
