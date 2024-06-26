import "dotenv/config";
import { z } from "zod";

export const envSchema = z.object({
  DISCORD_TOKEN: z.string(),
  DISCORD_CLIENT_ID: z.string(),
});

export type Env = z.infer<typeof envSchema>;

const environmentSchema = z.object({
  DISCORD_TOKEN: z.string(),
  DISCORD_CLIENT_ID: z.string(),
  REDIS_HOST: z.string().optional().default("127.0.0.1"),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_PASSWORD: z.string(),
  REDIS_DB: z.coerce.number().optional().default(0),
});

const validationSchema = environmentSchema.safeParse(process.env);

if (!validationSchema.success) {
  console.error("Invalid environment", validationSchema.error.format());
  throw new Error("Invalid environment");
}

export const env = validationSchema.data;
