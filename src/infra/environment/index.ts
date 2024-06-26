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
});

const validationSchema = environmentSchema.safeParse(process.env);

if (!validationSchema.success) {
  console.error("Invalid environment", validationSchema.error.format());
  throw new Error("Invalid environment");
}

export const env = validationSchema.data;
