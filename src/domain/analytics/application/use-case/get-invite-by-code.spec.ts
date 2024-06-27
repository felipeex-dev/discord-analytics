import { InMemoryInviteRepository } from "@test/repositories/in-memory-invite-repository copy";
import { makeInvite } from "@test/factories/make-invite";
import { GetInviteByCodeUseCase } from "./get-invite-by-code";

let inMemoryInviteRepository: InMemoryInviteRepository;
let sut: GetInviteByCodeUseCase;

describe("Get Invite By Code", () => {
  beforeEach(() => {
    inMemoryInviteRepository = new InMemoryInviteRepository();
    sut = new GetInviteByCodeUseCase(inMemoryInviteRepository);
  });

  it("should be able to get invite by code", async () => {
    const fakeInvite = makeInvite({ code: "abc" });
    inMemoryInviteRepository.items.push(fakeInvite);

    const invite = await sut.execute({ code: "abc" });

    expect(invite.isRight()).toBe(true);
    expect(invite.value).toEqual(
      expect.objectContaining({
        invite: inMemoryInviteRepository.items[0],
      })
    );
  });

  it("shouldn't be able to get invite with invalid code", async () => {
    const fakeInvite = makeInvite();
    inMemoryInviteRepository.items.push(fakeInvite);

    const invite = await sut.execute({ code: "abc" });

    expect(invite.isRight()).toBe(true);
    expect(invite.value).toEqual(null);
  });
});
