import { RedisService } from "@/infra/cache/redis";
import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { DiscordInviteRepository } from "../../repositories/discord-invite-repository";

export const addInviteCommand = {
  name: "add-invite",
  description: "Adicionar um convite para ser monitado.",
  options: [
    {
      name: "invite",
      description: "Adicione o código do invite EX: AaWB49AS",
      type: 3,
      required: true,
    },
  ],
};

export async function addInvite(
  interaction: ChatInputCommandInteraction<CacheType>
) {
  const redis = new RedisService();
  const discordMemberRepository = new DiscordInviteRepository(redis);

  discordMemberRepository.create(interaction);
}
