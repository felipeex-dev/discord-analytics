import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Invite,
  InviteProps,
} from "@/domain/analytics/enterprise/entities/invite";
import { faker } from "@faker-js/faker";

export function makeInvite(
  override: Partial<InviteProps> = {},
  id?: UniqueEntityID
): Invite {
  const invite = Invite.create(
    {
      name: faker.company.name(),
      code: faker.internet.domainName(),
      investmentValue: Number(faker.finance.amount()),
      ...override,
    },
    id
  );

  return invite;
}
