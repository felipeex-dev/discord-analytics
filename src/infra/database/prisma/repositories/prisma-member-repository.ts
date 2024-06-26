import { MemberRepository } from "@/domain/analytics/application/repositories/member-repository";
import { Member } from "@/domain/analytics/enterprise/entities/member";
import { prisma } from "..";
import { PrismaMemberMapper } from "../mappers/prisma-member-mapper";

export class PrismaMemberRepository implements MemberRepository {
  async create(member: Member) {
    const data = PrismaMemberMapper.toPrisma(member);

    await prisma.member.create({
      data,
    });
  }

  async findByDiscordId(discordId: string): Promise<Member | null> {
    const member = await prisma.member.findUnique({ where: { discordId } });

    if (!member) {
      return null;
    }

    return PrismaMemberMapper.toDomain(member);
  }
}
