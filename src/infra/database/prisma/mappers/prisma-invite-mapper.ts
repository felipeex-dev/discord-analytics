import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Invite } from "@/domain/analytics/enterprise/entities/invite";
import { Prisma, Invite as PrismaInvite } from "@prisma/client";

export class PrismaInviteMapper {
  static toDomain(raw: PrismaInvite): Invite {
    return Invite.create(
      {
        name: raw.name,
        code: raw.code,
        investmentValue: raw.investmentValue,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(invite: Invite): Prisma.InviteUncheckedCreateInput {
    return {
      id: invite.id.toString(),
      name: invite.name,
      code: invite.code,
      investmentValue: invite.investmentValue,
      createdAt: invite.createdAt,
      updatedAt: invite.updatedAt,
    };
  }
}
