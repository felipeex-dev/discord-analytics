import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface InviteProps {
  name: string;
  code: string;
  investmentValue: number;
  members: {
    count: number;
    clients: {
      count: number;
    };
  };
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Invite extends Entity<InviteProps> {
  get name() {
    return this.props.name;
  }

  get code() {
    return this.props.code;
  }

  get investmentValue() {
    return this.props.investmentValue;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get members() {
    return this.props.members;
  }

  static create(
    props: Optional<InviteProps, "createdAt" | "members">,
    id?: UniqueEntityID
  ) {
    const invite = new Invite(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        members: props.members ?? { count: 0, clients: { count: 0 } },
      },
      id
    );
    return invite;
  }
}
