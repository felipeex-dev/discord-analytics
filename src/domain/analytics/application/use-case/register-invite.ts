import { Either, left, right } from "@/core/either";
import { InviteRepository } from "../repositories/invite-repository";
import { Invite } from "../../enterprise/entities/invite";
import { InviteAlreadyExist } from "./errors/invite-already-exist";

export interface RegisterInviteUseCaseRequest {
  name: string;
  code: string;
  investmentValue: number;
}

type RegisterInviteUseCaseResponse = Either<
  InviteAlreadyExist,
  { invite: Invite }
>;

export class RegisterInviteUseCase {
  constructor(private inviteRepository: InviteRepository) {}
  async execute({
    name,
    code,
    investmentValue,
  }: RegisterInviteUseCaseRequest): Promise<RegisterInviteUseCaseResponse> {
    const findInviteByCode = await this.inviteRepository.findByCode(code);

    if (findInviteByCode) {
      return left(new InviteAlreadyExist(code));
    }

    const invite = Invite.create({
      name,
      code,
      investmentValue,
    });

    await this.inviteRepository.register(invite);
    return right({ invite });
  }
}
