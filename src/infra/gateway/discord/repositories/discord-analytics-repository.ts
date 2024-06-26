import { RedisService } from "@/infra/cache/redis";
import { GatewayAnalyticsRepository } from "../../repositories/gateway-analytics-repository";
import { CacheType, ChatInputCommandInteraction } from "discord.js";

export class DiscordAnalyticsRepository implements GatewayAnalyticsRepository {
  constructor(private redis: RedisService) {}
  async generate(
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<void> {
    const inviteCode = interaction.options.get("code")?.value as string;
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
