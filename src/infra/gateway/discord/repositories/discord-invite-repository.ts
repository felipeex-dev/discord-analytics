import { RedisService } from "@/infra/cache/redis";
import { GatewayInviteRepository } from "../../repositories/gateway-invite-respository";
import {
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { PrismaInviteRepository } from "@/infra/database/prisma/repositories/prisma-invite-repository";
import { RegisterInviteUseCase } from "@/domain/analytics/application/use-case/register-invite";

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
    const inviteName = interaction.options.get("name")?.value as string;
    const inviteCode = interaction.options.get("code")?.value as string;
    const inviteInvestimentValue = interaction.options.get("investment-value")
      ?.value as number;

    if (inviteCode && inviteCode) {
      const inviteCodeValue = inviteCode;
      const existsInvites = await interaction.guild?.invites.fetch();
      const isExistInviteToAdd = existsInvites?.find(
        (invite) => invite.code === inviteCodeValue
      );

      if (!isExistInviteToAdd) {
        const notExistInviteEmbed = new EmbedBuilder()
          .setDescription(
            "<:felipeexError:1255836519118143500> Esse código de convite não existe."
          )
          .setColor("#4971a0");
        return await interaction.editReply({
          embeds: [notExistInviteEmbed],
        });
      }

      const inviteExistInCache = await this.redis.get(
        inviteCodeValue.toString()
      );

      if (!inviteExistInCache) {
        const inviteUsesOrZero = isExistInviteToAdd.uses ?? 0;
        await this.redis.set(
          inviteCodeValue.toString(),
          inviteUsesOrZero.toString()
        );

        const inviteAddedEmbed = new EmbedBuilder()
          .setDescription(
            "<:felipeexSuccess:1255838822059474944> Convite adicionado com sucesso!"
          )
          .setColor("#4971a0");
        await interaction.editReply({
          embeds: [inviteAddedEmbed],
        });

        const prismaInviteRepository = new PrismaInviteRepository();
        const registerInviteUseCase = new RegisterInviteUseCase(
          prismaInviteRepository
        );

        await registerInviteUseCase.execute({
          name: inviteName,
          code: inviteCodeValue.toString(),
          investmentValue: inviteInvestimentValue ?? 0,
        });

        this.redis.disconnect();
      } else {
        const invitedWasAdded = new EmbedBuilder()
          .setDescription(
            "<:felipeexWarn:1255838220311199844> Esse convite já foi adicionado."
          )
          .setColor("#4971a0");

        await interaction.editReply({
          embeds: [invitedWasAdded],
        });
      }
    }
  }
}
