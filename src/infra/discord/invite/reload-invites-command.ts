import { RedisService } from "@/infra/cache/redis";
import { RedisCacheRepository } from "@/infra/cache/redis/redis-cache-repository";
import { CacheType, ChatInputCommandInteraction } from "discord.js";

export const reloadInviteCommand = {
  name: "reload-invites",
  description: "Recarregar todas as quantidades de usos do convites.",
};

export async function reloadInvites(
  interaction: ChatInputCommandInteraction<CacheType>
) {
  await interaction.deferReply({ ephemeral: true });
  const guildInvites = await interaction.guild?.invites.fetch();

  const redisService = new RedisService();
  const redis = new RedisCacheRepository(redisService);
  const invitesCache = await redisService.keys("*");

  invitesCache.map(async (invite) => {
    const guildInvite = guildInvites?.get(invite);
    if (!(guildInvite && guildInvite.uses)) return;

    await redis.set(invite, guildInvite.uses.toString());
  });

  await interaction.editReply({
    content: "Recarregado com sucesso!",
  });

  redisService.disconnect();
}
