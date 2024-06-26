import { MemberRepository } from "@/domain/analytics/application/repositories/member-repository";
import { Member } from "@/domain/analytics/enterprise/entities/member";

export class PrismaMemberRepository implements MemberRepository {
  async create(member: Member) {
    console.log(member);
    // throw new Error("Method not implemented.");
  }

  async findByDiscordId(discordId: string): Promise<Member | null> {
    return null;
    // throw new Error("Method not implemented.");
  }
}
