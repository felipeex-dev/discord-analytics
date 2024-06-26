import { InviteRepository } from "@/domain/analytics/application/repositories/invite-repository";
import { Invite } from "@/domain/analytics/enterprise/entities/invite";

export class InMemoryInviteRepository implements InviteRepository {
  public items: Invite[] = [];

  async register(invite: Invite) {
    this.items.push(invite);
  }
}
