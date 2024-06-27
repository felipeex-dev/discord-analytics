import { RedisService } from "@/infra/cache/redis";
import { GatewayAnalyticsRepository } from "../../repositories/gateway-analytics-repository";
import {
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { PrismaInviteRepository } from "@/infra/database/prisma/repositories/prisma-invite-repository";
import { GetInviteByCodeUseCase } from "@/domain/analytics/application/use-case/get-invite-by-code";
import { format } from "date-fns";

export class DiscordAnalyticsRepository implements GatewayAnalyticsRepository {
  constructor(private redis: RedisService) {}

  async generate(
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<void> {
    await interaction.deferReply({ ephemeral: true });
    const inviteCode = interaction.options.get("code")?.value as string;

    const prismaInviteRepository = new PrismaInviteRepository();
    const getInviteByCodeUseCase = new GetInviteByCodeUseCase(
      prismaInviteRepository
    );

    const prismaInvite = await getInviteByCodeUseCase.execute({
      code: inviteCode,
    });

    if (prismaInvite.value?.invite) {
      const invite = prismaInvite.value.invite;
      const inviteUses = (await this.redis.get(inviteCode)) ?? "0";
      const initInviteDate = format(invite.createdAt, "dd/MM/yyyy 'as' HH:mm");

      await interaction.editReply({
        content: `
        # ${invite.name} | Data de inicio: ${initInviteDate}
        > - **Código de convite**: *${
          invite.code
        }* ([Acessar convite](https://discord.gg/${invite.code}))
        > - **Valor investido**: *R$${invite.investmentValue}*
        > - **Quantidade de Entradas**: *${inviteUses}*
        > - **Membros convertidos**: *${invite.members.count}*
        > - **Clientes convertidos**: *${invite.members.clients.count}*
        > - **Taxa de conversão para membros**: *${
          (invite.members.count / Number(inviteUses)) * 100
        }%*
        > - **Taxa de conversão para clientes**: *${
          (invite.members.clients.count / Number(inviteUses)) * 100
        }%*
        > - **CAC (Custo de aquisição por membro)**: *R$ ${
          isFinite(invite.investmentValue / invite.members.count)
            ? invite.investmentValue / invite.members.count
            : "dados insuficientes."
        }*
        > - **CAC (Custo de aquisição por cliente)**: *R$ ${
          isFinite(invite.investmentValue / invite.members.clients.count)
            ? invite.investmentValue / invite.members.clients.count
            : "dados insuficientes."
        }*
      `,
      });
    } else {
      const notExistInviteEmbed = new EmbedBuilder()
        .setDescription(
          "<:felipeexError:1255836519118143500> Esse código de convite não existe."
        )
        .setColor("#4971a0");
      await interaction.editReply({
        embeds: [notExistInviteEmbed],
      });
    }
  }
}
