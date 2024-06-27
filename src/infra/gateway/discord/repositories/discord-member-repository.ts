import { GuildMember, PartialGuildMember } from "discord.js";
import { GatewayMemberRepository } from "../../repositories/gateway-member-repository";
import { CreateMemberUseCase } from "@/domain/analytics/application/use-case/create-member";
import { PrismaMemberRepository } from "@/infra/database/prisma/repositories/prisma-member-repository";
import { RedisService } from "@/infra/cache/redis";
import { PrismaInviteRepository } from "@/infra/database/prisma/repositories/prisma-invite-repository";
import { GetInviteByCodeUseCase } from "@/domain/analytics/application/use-case/get-invite-by-code";
import { env } from "@/infra/environment";
import { UpdateMemberUseCase } from "@/domain/analytics/application/use-case/update-member";

export class DiscordMemberRepository implements GatewayMemberRepository {
  constructor(private redis: RedisService) {}

  async create({ guild, id, displayName, client }: GuildMember) {
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

        const channel = await client.channels.fetch(
          env.DISCORD_INPUT_CHANNEL_ID
        );

        if (channel?.isTextBased()) {
          const prismaInviteRepository = new PrismaInviteRepository();
          const getInviteByCodeUseCase = new GetInviteByCodeUseCase(
            prismaInviteRepository
          );

          const prismaInvite = await getInviteByCodeUseCase.execute({
            code: invite,
          });

          await channel.send(
            `<@${id}> foi convertido por ${prismaInvite.value?.invite.name} - ${prismaInvite.value?.invite.code}`
          );
        }

        this.redis.disconnect();
      }
    });
  }

  async update(
    oldMember: GuildMember | PartialGuildMember,
    newMember: GuildMember
  ): Promise<void> {
    const hadClientRole = oldMember.roles.cache.some(
      (role) => role.id === env.DISCORD_CLIENT_ROLE_ID
    );

    const hasClientRole = newMember.roles.cache.some(
      (role) => role.id === env.DISCORD_CLIENT_ROLE_ID
    );

    const hasClientRoleNow = !hadClientRole && hasClientRole;

    const discordMemberRepository = new PrismaMemberRepository();
    const updateMemberUseCase = new UpdateMemberUseCase(
      discordMemberRepository
    );

    updateMemberUseCase.execute({
      discordId: oldMember.id,
      isClient: hasClientRoleNow,
    });
  }
}
