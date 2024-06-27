import { Either, left, right } from "@/core/either";
import { InviteRepository } from "../repositories/invite-repository";
import { Invite } from "../../enterprise/entities/invite";

export interface GetInviteByCodeUseCaseRequest {
  code: string;
}

type GetInviteByCodeUseCaseResponse = Either<void, { invite: Invite } | null>;

export class GetInviteByCodeUseCase {
  constructor(private inviteRepository: InviteRepository) {}
  async execute({
    code,
  }: GetInviteByCodeUseCaseRequest): Promise<GetInviteByCodeUseCaseResponse> {
    const invite = await this.inviteRepository.findByCode(code);

    if (!invite) {
      return right(null);
    }

    return right({ invite });
  }
}
