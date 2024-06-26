export abstract class GatewayMemberRepository {
  abstract create(member: unknown): Promise<void>;
}
