import { MemberRepository } from "@/domain/analytics/application/repositories/member-repository";
import { Member } from "@/domain/analytics/enterprise/entities/member";

export class PrismaMemberRepository implements MemberRepository {
  create(member: Member): Promise<void> {
    console.log(member);
    throw new Error("Method not implemented.");
  }

  findByDiscordId(discordId: string): Promise<Member | null> {
    throw new Error("Method not implemented.");
  }
}
