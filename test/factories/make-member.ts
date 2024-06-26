import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Member,
  MemberProps,
} from "@/domain/analytics/enterprise/entities/member";
import { faker } from "@faker-js/faker";
import { randomUUID } from "crypto";

export function makeMember(
  override: Partial<MemberProps> = {},
  id?: UniqueEntityID
): Member {
  const member = Member.create(
    {
      discordId: randomUUID(),
      name: faker.person.fullName(),
      origin: faker.internet.domainName(),
      ...override,
    },
    id
  );

  return member;
}
