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
    const invite = await prisma.invite.findUnique({
      where: { code },
      include: {
        _count: { select: { members: true } },
      },
    });

    const clients = await prisma.invite.findUnique({
      where: { code },
      select: {
        _count: { select: { members: { where: { isClient: true } } } },
      },
    });

    if (!invite) {
      return null;
    }

    return PrismaInviteMapper.toDomain({
      ...invite,
      _count: {
        members: invite._count.members,
        clients: clients?._count.members ?? 0,
      },
    });
  }
}
