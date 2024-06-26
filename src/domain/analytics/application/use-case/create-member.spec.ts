import { InMemoryMemberRepository } from "@test/repositories/in-memory-member-repository";
import { CreateMemberUseCase } from "./create-member";
import { makeMember } from "@test/factories/make-member";
import { MemberAlreadyExistError } from "./errors/member-already-exist";

let inMemoryMemberRepository: InMemoryMemberRepository;
let sut: CreateMemberUseCase;

describe("Create Member", () => {
  beforeEach(() => {
    inMemoryMemberRepository = new InMemoryMemberRepository();
    sut = new CreateMemberUseCase(inMemoryMemberRepository);
  });

  it("should be able to create a new member", async () => {
    const fakeMember = makeMember();
    const member = await sut.execute(fakeMember);

    expect(member.isRight()).toBe(true);
    expect(member.value).toEqual(
      expect.objectContaining({
        member: inMemoryMemberRepository.items[0],
      })
    );
  });

  it("shouldn't be able to create a new member with the same discordId", async () => {
    const fakeMember = makeMember({ discordId: "johndoe" });
    const fakeMemberWithSameDiscordId = makeMember({
      discordId: "johndoe",
    });

    await sut.execute(fakeMember);
    const memberWithSameDiscordId = await sut.execute(
      fakeMemberWithSameDiscordId
    );

    expect(memberWithSameDiscordId.isLeft()).toBe(true);
    expect(memberWithSameDiscordId.value).toBeInstanceOf(
      MemberAlreadyExistError
    );
  });
});
