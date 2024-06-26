import { PrismaClient } from "@prisma/client";

export class PrismaService extends PrismaClient {
  constructor() {
    super({
      log: ["warn", "error"],
    });
  }
}

const prisma = new PrismaService();
export { prisma };
