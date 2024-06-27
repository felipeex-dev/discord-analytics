import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface MemberProps {
  inviteCode: string;
  discordId: string;
  name: string;
  isClient: boolean;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Member extends Entity<MemberProps> {
  get inviteCode() {
    return this.props.inviteCode;
  }

  get discordId() {
    return this.props.discordId;
  }

  get name() {
    return this.props.name;
  }

  get isClient() {
    return this.props.isClient;
  }

  set isClient(isClient: boolean) {
    this.props.isClient = isClient;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<MemberProps, "createdAt" | "isClient">,
    id?: UniqueEntityID
  ) {
    const member = new Member(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        isClient: props.isClient ?? false,
      },
      id
    );
    return member;
  }
}
