import { MemberRepository } from "@/domain/analytics/application/repositories/member-repository";
import { Member } from "@/domain/analytics/enterprise/entities/member";

export class InMemoryMemberRepository implements MemberRepository {
  public items: Member[] = [];

  async create(member: Member) {
    this.items.push(member);
  }

  async findByDiscordId(discordId: string) {
    const member = this.items.find((member) => member.discordId === discordId);

    if (!member) {
      return null;
    }

    return member;
  }
}
