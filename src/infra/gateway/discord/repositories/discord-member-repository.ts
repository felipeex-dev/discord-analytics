import { GuildMember } from "discord.js";
import { GatewayMemberRepository } from "../../repositories/gateway-member-repository";
import { CreateMemberUseCase } from "@/domain/analytics/application/use-case/create-member";
import { PrismaMemberRepository } from "@/infra/database/prisma/repositories/prisma-member-repository";
import { RedisService } from "@/infra/cache/redis";

export class DiscordMemberRepository implements GatewayMemberRepository {
  constructor(private redis: RedisService) {}

  async create({ guild, id, displayName }: GuildMember) {
    const invites = await guild.invites.fetch();
    const invitesCache = await this.redis.keys("*");

    invitesCache.map(async (invite) => {
      const inviteUsesInCache = await this.redis.get(invite);
      const guildInvite = invites.get(invite);
      if (!(guildInvite && guildInvite.uses)) return;

      if (guildInvite.uses > Number(inviteUsesInCache)) {
        const newQuantityOfInvite = Number(inviteUsesInCache) + 1;
        await this.redis.set(invite, newQuantityOfInvite.toString());

        const prismaMemberRepository = new PrismaMemberRepository();
        const createMemberUseCase = new CreateMemberUseCase(
          prismaMemberRepository
        );

        await createMemberUseCase.execute({
          inviteCode: invite,
          discordId: id,
          name: displayName,
        });

        this.redis.disconnect();
      }
    });
  }
}
