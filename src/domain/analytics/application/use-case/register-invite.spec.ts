import { InMemoryInviteRepository } from "@test/repositories/in-memory-invite-repository copy";
import { RegisterInviteUseCase } from "./register-invite";
import { makeInvite } from "@test/factories/make-invite";

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
});
