export abstract class CacheRepository {
  abstract set(key: string, value: string): Promise<void>;
  abstract get(key: string): Promise<string | null>;
  abstract keys(pattern: string): Promise<string[]>;
  abstract delete(key: string): Promise<void>;
}
