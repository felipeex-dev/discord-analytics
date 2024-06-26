import { RedisService } from "@/infra/cache/redis";
import { GatewayInviteRepository } from "../../repositories/gateway-invite-respository";
import { CacheType, ChatInputCommandInteraction } from "discord.js";

export class DiscordInviteRepository implements GatewayInviteRepository {
  constructor(private redis: RedisService) {}

  async reload(
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<void> {
    await interaction.deferReply({ ephemeral: true });
    const redis = new RedisService();
    const guildInvites = await interaction.guild?.invites.fetch();
    const invitesCache = await redis.keys("*");

    invitesCache.map(async (invite) => {
      const guildInvite = guildInvites?.get(invite);
      if (!(guildInvite && guildInvite.uses)) return;

      await redis.set(invite, guildInvite.uses.toString());
    });

    await interaction.editReply({
      content: "Recarregado com sucesso!",
    });

    redis.disconnect();
  }

  async create(interaction: ChatInputCommandInteraction<CacheType>) {
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

      const inviteExistInCache = await this.redis.get(
        inviteCodeValue.toString()
      );

      if (!inviteExistInCache) {
        const inviteUsesOrZero = isExistInviteToAdd.uses ?? 0;
        await this.redis.set(
          inviteCodeValue.toString(),
          inviteUsesOrZero.toString()
        );
        await interaction.editReply({
          content: "Convite adicionado com sucesso!",
        });

        this.redis.disconnect();
      } else {
        await interaction.editReply({
          content: "Esse convite já foi adicionado.",
        });
      }
    }
  }
}
