import { RedisService } from "@/infra/cache/redis";
import { RedisCacheRepository } from "@/infra/cache/redis/redis-cache-repository";
import { CacheType, ChatInputCommandInteraction } from "discord.js";

export const inviteCommand = {
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
  await interaction.deferReply({ ephemeral: true });
  const inviteCode = interaction.options.get("invite");

  if (inviteCode && inviteCode.value) {
    const inviteCodeValue = inviteCode.value;
    const existsInvites = await interaction.guild?.invites.fetch();
    const isExistInviteToAdd = existsInvites?.find(
      (invite) => invite.code === inviteCodeValue
    );

    if (!isExistInviteToAdd)
      return await interaction.editReply({
        content: "Esse código de convite não existe.",
      });

    const redisService = new RedisService();
    const redis = new RedisCacheRepository(redisService);
    const inviteExistInCache = await redis.get(inviteCodeValue.toString());

    if (!inviteExistInCache) {
      await redis.set(inviteCodeValue.toString(), "0");
      await interaction.editReply({
        content: "Convite adicionado com sucesso!",
      });
    } else {
      await interaction.editReply({
        content: "Esse convite já foi adicionado.",
      });
    }

    redisService.disconnect();
  }
}
