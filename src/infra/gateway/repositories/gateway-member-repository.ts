export abstract class GatewayMemberRepository {
  abstract create(member: unknown): Promise<void>;
  abstract update(oldMember: unknown, newMember: unknown): Promise<void>;
}
