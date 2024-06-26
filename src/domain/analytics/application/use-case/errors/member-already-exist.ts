import { UseCaseError } from "@/core/errors/use-case-error";

export class MemberAlreadyExistError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Member ${identifier} already exists.`);
  }
}
