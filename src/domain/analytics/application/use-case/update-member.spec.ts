import { InMemoryMemberRepository } from "@test/repositories/in-memory-member-repository";
import { makeMember } from "@test/factories/make-member";
import { UpdateMemberUseCase } from "./update-member";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

let inMemoryMemberRepository: InMemoryMemberRepository;
let sut: UpdateMemberUseCase;

describe("Update Member", () => {
  beforeEach(() => {
    inMemoryMemberRepository = new InMemoryMemberRepository();
    sut = new UpdateMemberUseCase(inMemoryMemberRepository);
  });

  it("should be able to update a member", async () => {
    const fakeMember = makeMember();
    inMemoryMemberRepository.items.push(fakeMember);
    const member = await sut.execute({
      discordId: fakeMember.discordId,
      isClient: true,
    });

    expect(member.isRight()).toBe(true);
    expect(member.value).toEqual(
      expect.objectContaining({
        member: inMemoryMemberRepository.items[0],
      })
    );

    if (member.isRight()) {
      expect(member.value.member.isClient).toBe(true);
    }
  });

  it("shouldn't be able to update a invalid member", async () => {
    const member = await sut.execute({
      discordId: "invalid-id",
      isClient: true,
    });

    expect(member.isLeft()).toBe(true);
    expect(member.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
