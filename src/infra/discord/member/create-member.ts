import { CreateMemberUseCase } from "@/domain/analytics/application/use-case/create-member";
import { redis, redisService } from "@/infra/cache/redis";
import { RedisCacheRepository } from "@/infra/cache/redis/redis-cache-repository";
import { PrismaMemberRepository } from "@/infra/database/prisma/repositories/prisma-member-repository";
import { GuildMember } from "discord.js";

export async function CreateMember(member: GuildMember) {
  const guildInvites = await member.guild.invites.fetch();

  const invitesCache = await redisService.keys("*");

  invitesCache.map(async (invite) => {
    const inviteInCache = Number(await redis.get(invite));
    const guildInvite = guildInvites.get(invite);
    if (!(guildInvite && guildInvite.uses)) return;

    if (guildInvite.uses > inviteInCache) {
      await redis.set(invite, (inviteInCache + 1).toString());
      console.log(member.id, member.displayName, invite);
    }
  });
}
