import { Either, left, right } from "@/core/either";
import { MemberRepository } from "../repositories/member-repository";
import { Member } from "../../enterprise/entities/member";
import { MemberAlreadyExistError } from "./errors/member-already-exist";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

export interface UpdateMemberUseCaseRequest {
  discordId: string;
  isClient: boolean;
}

type UpdateMemberUseCaseResponse = Either<
  ResourceNotFoundError,
  { member: Member }
>;

export class UpdateMemberUseCase {
  constructor(private memberRepository: MemberRepository) {}
  async execute({
    discordId,
    isClient,
  }: UpdateMemberUseCaseRequest): Promise<UpdateMemberUseCaseResponse> {
    const findMemberByDiscordId = await this.memberRepository.findByDiscordId(
      discordId
    );

    if (!findMemberByDiscordId) {
      return left(new ResourceNotFoundError());
    }

    const member = findMemberByDiscordId;
    member.isClient = isClient;

    await this.memberRepository.update(member);
    return right({ member });
  }
}
