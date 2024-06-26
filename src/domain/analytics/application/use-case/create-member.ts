import { Either, left, right } from "@/core/either";
import { MemberRepository } from "../repositories/member-repository";
import { Member } from "../../enterprise/entities/member";
import { MemberAlreadyExistError } from "./errors/member-already-exist";

export interface CreateMemberUseCaseRequest {
  inviteCode: string;
  discordId: string;
  name: string;
}

type CreateMemberUseCaseResponse = Either<
  MemberAlreadyExistError,
  { member: Member }
>;

export class CreateMemberUseCase {
  constructor(private memberRepository: MemberRepository) {}
  async execute({
    inviteCode,
    discordId,
    name,
  }: CreateMemberUseCaseRequest): Promise<CreateMemberUseCaseResponse> {
    const findMemberByDiscordId = await this.memberRepository.findByDiscordId(
      discordId
    );

    if (findMemberByDiscordId) {
      return left(new MemberAlreadyExistError(discordId));
    }

    const member = Member.create({
      inviteCode,
      discordId,
      name,
    });

    await this.memberRepository.create(member);
    return right({ member });
  }
}
