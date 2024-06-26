import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Member,
  MemberProps,
} from "@/domain/analytics/enterprise/entities/member";
import { faker } from "@faker-js/faker";
import { randomUUID } from "node:crypto";

export function makeMember(
  override: Partial<MemberProps> = {},
  id?: UniqueEntityID
): Member {
  const member = Member.create(
    {
      inviteCode: faker.internet.domainName(),
      discordId: randomUUID(),
      name: faker.person.fullName(),
      ...override,
    },
    id
  );

  return member;
}
