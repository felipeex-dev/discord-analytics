import { InMemoryInviteRepository } from "@test/repositories/in-memory-invite-repository copy";
import { RegisterInviteUseCase } from "./register-invite";
import { makeInvite } from "@test/factories/make-invite";
import { InviteAlreadyExist } from "./errors/invite-already-exist";

let inMemoryInviteRepository: InMemoryInviteRepository;
let sut: RegisterInviteUseCase;

describe("Register Invite", () => {
  beforeEach(() => {
    inMemoryInviteRepository = new InMemoryInviteRepository();
    sut = new RegisterInviteUseCase(inMemoryInviteRepository);
  });

  it("should be able to register a new invite", async () => {
    const fakeInvite = makeInvite();
    const invite = await sut.execute(fakeInvite);

    expect(invite.isRight()).toBe(true);
    expect(invite.value).toEqual(
      expect.objectContaining({
        invite: inMemoryInviteRepository.items[0],
      })
    );
  });

  it("shouldn't be able to register a new invite with the same code", async () => {
    const fakeInvite = makeInvite({ code: "abc" });
    const fakeInviteWithSameCode = makeInvite({ code: "abc" });

    await sut.execute(fakeInvite);
    const inviteWithSameCode = await sut.execute(fakeInviteWithSameCode);

    expect(inviteWithSameCode.isLeft()).toBe(true);
    expect(inviteWithSameCode.value).toBeInstanceOf(InviteAlreadyExist);
  });
});
