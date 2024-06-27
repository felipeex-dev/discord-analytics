import { UseCaseError } from "@/core/errors/use-case-error";

export class InviteAlreadyExist extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Member ${identifier} already exists.`);
  }
}
