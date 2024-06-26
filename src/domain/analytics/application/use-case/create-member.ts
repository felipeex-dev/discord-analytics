import { Either, left, right } from "@/core/either";
import { MemberRepository } from "../repositories/member-repository";
import { Member } from "../../enterprise/entities/member";
import { MemberAlreadyExistError } from "./errors/member-already-exist";

export interface CreateMemberUseCaseRequest {
  discordId: string;
  name: string;
  origin: string;
}

type CreateMemberUseCaseResponse = Either<unknown, { member: Member }>;

export class CreateMemberUseCase {
  constructor(private memberRepository: MemberRepository) {}
  async execute({
    discordId,
    name,
    origin,
  }: CreateMemberUseCaseRequest): Promise<CreateMemberUseCaseResponse> {
    const findMemberByDiscordId = await this.memberRepository.findByDiscordId(
      discordId
    );

    if (findMemberByDiscordId) {
      return left(new MemberAlreadyExistError(discordId));
    }

    const member = Member.create({
      discordId,
      name,
      origin,
    });

    await this.memberRepository.create(member);
    return right({ member });
  }
}
