import { InviteRepository } from "@/domain/analytics/application/repositories/invite-repository";
import { Invite } from "@/domain/analytics/enterprise/entities/invite";

export class InMemoryInviteRepository implements InviteRepository {
  public items: Invite[] = [];

  async register(invite: Invite) {
    this.items.push(invite);
  }

  async findByCode(code: string) {
    const invite = this.items.find((item) => item.code === code);

    if (!invite) {
      return null;
    }

    return invite;
  }
}
