export abstract class GatewayInviteRepository {
  abstract create(inviteCode: unknown): Promise<unknown>;
  abstract reload(interaction: unknown): Promise<void>;
}
