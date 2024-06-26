import { Invite } from "../../enterprise/entities/invite";

export abstract class InviteRepository {
  abstract register(invite: Invite): Promise<void>;
}
