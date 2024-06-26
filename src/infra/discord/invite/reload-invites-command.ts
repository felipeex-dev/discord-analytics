import { redis, redisService } from "@/infra/cache/redis";
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

  const invitesCache = await redisService.keys("*");

  invitesCache.map(async (invite) => {
    const guildInvite = guildInvites?.get(invite);
    if (!(guildInvite && guildInvite.uses)) return;

    await redis.set(invite, guildInvite.uses.toString());
  });

  await interaction.editReply({
    content: "Recarregado com sucesso!",
  });
}
