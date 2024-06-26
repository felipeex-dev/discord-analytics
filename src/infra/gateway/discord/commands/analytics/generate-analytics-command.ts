import { RedisService } from "@/infra/cache/redis";
import {
  ApplicationCommandOptionType,
  CacheType,
  ChatInputCommandInteraction,
} from "discord.js";
import { DiscordAnalyticsRepository } from "../../repositories/discord-analytics-repository";

export const generateAnalyticsCommand = {
  name: "generate-analytics",
  description: "Gerar análise de um convite monitorado.",
  options: [
    {
      name: "code",
      description: "Código do invite EX: AaWB49AS",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

export async function generateAnalytics(
  interaction: ChatInputCommandInteraction<CacheType>
) {
  const redis = new RedisService();
  const discordAnalyticsRepository = new DiscordAnalyticsRepository(redis);

  discordAnalyticsRepository.generate(interaction);
}
