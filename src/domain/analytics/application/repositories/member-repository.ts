import { Member } from "../../enterprise/entities/member";

export abstract class MemberRepository {
  abstract create(member: Member): Promise<void>;
  abstract findByDiscordId(discordId: string): Promise<Member | null>;
}
