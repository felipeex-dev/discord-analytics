import { env } from "@/infra/environment";
import { Redis } from "ioredis";

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
