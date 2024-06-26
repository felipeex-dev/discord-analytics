import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Member } from "@/domain/analytics/enterprise/entities/member";
import { Prisma, Member as PrismaMember } from "@prisma/client";

export class PrismaMemberMapper {
  static toDomain(raw: PrismaMember): Member {
    return Member.create(
      {
        inviteCode: raw.inviteCode,
        discordId: raw.discordId,
        name: raw.name,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(member: Member): Prisma.MemberUncheckedCreateInput {
    return {
      inviteCode: member.inviteCode,
      id: member.id.toString(),
      discordId: member.discordId,
      name: member.name,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };
  }
}
