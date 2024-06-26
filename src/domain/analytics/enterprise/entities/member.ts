import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface MemberProps {
  discordId: string
  name: string;
  origin: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Member extends Entity<MemberProps> {
  get discordId() {
    return this.props.discordId;
  }

  get name() {
    return this.props.name;
  }

  get origin() {
    return this.props.origin;
  }

  static create(
    props: Optional<MemberProps, "createdAt">,
    id?: UniqueEntityID
  ) {
    const member = new Member(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id
    );
    return member;
  }
}
