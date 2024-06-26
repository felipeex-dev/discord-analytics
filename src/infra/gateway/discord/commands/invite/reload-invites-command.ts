import { RedisService } from "@/infra/cache/redis";
import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { DiscordInviteRepository } from "../../repositories/discord-invite-repository";

export const reloadInviteCommand = {
  name: "reload-invites",
  description: "Recarregar todas as quantidades de usos do convites.",
};

export async function reloadInvites(
  interaction: ChatInputCommandInteraction<CacheType>
) {
  const redis = new RedisService();
  const discordMemberRepository = new DiscordInviteRepository(redis);

  discordMemberRepository.reload(interaction);
}
