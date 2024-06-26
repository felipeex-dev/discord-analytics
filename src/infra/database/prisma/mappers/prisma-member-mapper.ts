import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Member } from "@/domain/analytics/enterprise/entities/member";

export class PrismaMemberMapper {
  static toDomain(raw: PrismaMember): Member {
    return Member.create(
      {
        discordId: raw,
        name: raw.name,
        password: raw.password,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(student: Member): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
      password: student.password,
    };
  }
}
