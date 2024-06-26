import { CreateMemberUseCase } from "@/domain/analytics/application/use-case/create-member";
import { PrismaMemberRepository } from "@/infra/database/prisma/repositories/prisma-member-repository";
import { AuditLogEvent, Collection, GuildMember, Invite } from "discord.js";

const invites = new Map<string, Invite>();
export async function CreateMember(member: GuildMember) {
  const newInvites = await member.guild.invites.fetch();
}
