import { InviteRepository } from "@/domain/analytics/application/repositories/invite-repository";
import { Invite } from "@/domain/analytics/enterprise/entities/invite";
import { prisma } from "..";
import { PrismaInviteMapper } from "../mappers/prisma-invite-mapper";

export class PrismaInviteRepository implements InviteRepository {
  async register(invite: Invite) {
    const data = PrismaInviteMapper.toPrisma(invite);

    await prisma.invite.create({
      data,
    });
  }

  async findByCode(code: string) {
    const invite = await prisma.invite.findUnique({ where: { code } });

    if (!invite) {
      return null;
    }

    return PrismaInviteMapper.toDomain(invite);
  }
}
