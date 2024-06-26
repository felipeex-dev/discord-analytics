export abstract class GatewayAnalyticsRepository {
  abstract generate(interaction: unknown): Promise<void>;
}
