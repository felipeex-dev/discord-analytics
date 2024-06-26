import { RedisService } from "@/infra/cache/redis";
import {
  ApplicationCommandOptionType,
  CacheType,
  ChatInputCommandInteraction,
} from "discord.js";
import { DiscordInviteRepository } from "../../repositories/discord-invite-repository";

export const addInviteCommand = {
  name: "add-invite",
  description: "Adicionar um convite para ser monitado.",
  options: [
    {
      name: "name",
      description: "Adicione o nome do convite",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "code",
      description: "Adicione o código do invite EX: AaWB49AS",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "investment-value",
      description: "Adicione o valor do investimento",
      type: ApplicationCommandOptionType.Number,
      required: false,
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
