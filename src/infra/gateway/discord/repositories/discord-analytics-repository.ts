import { RedisService } from "@/infra/cache/redis";
import { GatewayAnalyticsRepository } from "../../repositories/gateway-analytics-repository";
import {
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { PrismaInviteRepository } from "@/infra/database/prisma/repositories/prisma-invite-repository";
import { GetInviteByCodeUseCase } from "@/domain/analytics/application/use-case/get-invite-by-code";
import { prisma } from "@/infra/database/prisma";

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
      const inviteUses = await this.redis.get(inviteCode);
      const prismaInviteCount = await prisma.invite.findUnique({
        where: { code: inviteCode },
        select: { _count: { select: { members: true } } },
      });

      const quantityOfMembers = prismaInviteCount?._count.members!;

      const embed = new EmbedBuilder()
        .setColor("White")
        .setTitle(
          `${prismaInvite.value.invite.name} - ${prismaInvite.value.invite.code}`
        )
        .setFields([
          {
            name: "Valor investido",
            value: "```R$" + prismaInvite.value.invite.investmentValue + "```",
          },
          { name: "Quantidade de Entradas", value: "```" + inviteUses + "```" },
          {
            name: "Membros convertidos",
            value: "```" + quantityOfMembers + "```",
          },
          { name: "Clientes convertidos", value: "```?```" },
          { name: "Taxa de conversão para clientes", value: "```0%```" },
          {
            name: "CAC (Custo de aquisição de membros)",
            value:
              "```R$" +
              (quantityOfMembers === 0
                ? "Sem dados"
                : prismaInvite.value.invite.investmentValue /
                  quantityOfMembers) +
              "```",
          },
          { name: "CAC (Custo de aquisição de clientes)", value: "```?```" },
        ]);

      await interaction.editReply({ embeds: [embed] });
    } else {
      await interaction.editReply({
        content: "Esse código de convite não existe.",
      });
    }
  }
}

/* Divulgação 1 - BrmGuU592M | Data de inicio: 25/06/24 as 13:50
Valor investido: R$25
Quantidade de Entradas: 15
Membros convertidos: 10
Clientes convertidos: 5
Taxa de conversão para clientes: 50%
CAC (Custo de aquisição de clientes): R$5
Status: Ativo */
