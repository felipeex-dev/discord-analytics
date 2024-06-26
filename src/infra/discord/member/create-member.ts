import { CreateMemberUseCase } from "@/domain/analytics/application/use-case/create-member";
import { redis, redisService } from "@/infra/cache/redis";
import { PrismaMemberRepository } from "@/infra/database/prisma/repositories/prisma-member-repository";
import { GuildMember } from "discord.js";

export async function CreateMember({ guild, id, displayName }: GuildMember) {
  const guildInvites = await guild.invites.fetch();
  const invitesCache = await redisService.keys("*");

  invitesCache.map(async (invite) => {
    const inviteInCache = Number(await redis.get(invite));
    const guildInvite = guildInvites.get(invite);
    if (!(guildInvite && guildInvite.uses)) return;

    if (guildInvite.uses > inviteInCache) {
      await redis.set(invite, (inviteInCache + 1).toString());

      const prismaMemberRepository = new PrismaMemberRepository();
      const createMemberUseCase = new CreateMemberUseCase(
        prismaMemberRepository
      );

      await createMemberUseCase.execute({
        discordId: id,
        name: displayName,
        origin: invite,
      });
    }
  });
}
