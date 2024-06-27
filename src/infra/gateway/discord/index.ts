import {
  Client,
  GatewayIntentBits,
  GuildMember,
  Partials,
  REST,
  Routes,
} from "discord.js";
import {
  addInvite,
  addInviteCommand,
} from "./commands/invite/add-invite-command";
import {
  reloadInviteCommand,
  reloadInvites,
} from "./commands/invite/reload-invites-command";
import { env } from "@/infra/environment";
import { DiscordMemberRepository } from "./repositories/discord-member-repository";
import { RedisService } from "@/infra/cache/redis";
import {
  generateAnalytics,
  generateAnalyticsCommand,
} from "./commands/analytics/generate-analytics-command";

const commands = [
  { function: addInvite, informations: addInviteCommand },
  { function: reloadInvites, informations: reloadInviteCommand },
  { function: generateAnalytics, informations: generateAnalyticsCommand },
];

export class DiscordBOT extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildInvites,
      ],
      partials: [Partials.GuildMember],
    });
  }

  async init() {
    const discordREST = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);

    try {
      await discordREST.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), {
        body: commands.map((command) => {
          return command.informations;
        }),
      });

      this.login(env.DISCORD_TOKEN);
      console.log("Discord BOT is starting...");
    } catch (error) {
      console.log(error);
    }
  }
}

const discord = new DiscordBOT();

discord.once("ready", async (client) => {
  console.log("Discord BOT started!");

  const redis = new RedisService();
  const invitesCache = await redis.keys("*");
  const guildInvites = await client.guilds.cache
    .get(env.DISCORD_GUILD_ID)
    ?.invites.fetch();

  invitesCache.map(async (invite) => {
    const guildInvite = guildInvites?.get(invite);
    if (!(guildInvite && guildInvite.uses)) return;

    await redis.set(invite, guildInvite.uses.toString());
  });

  redis.disconnect();
});

discord.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  commands.map((command) => {
    if (interaction.commandName === command.informations.name) {
      command.function(interaction);
    }
  });
});

discord.on("guildMemberAdd", (member) => {
  const redis = new RedisService();
  const discordMemberRepository = new DiscordMemberRepository(redis);

  discordMemberRepository.create(member);
});

discord.on("guildMemberUpdate", (oldMember, newMember) => {
  const hadClientRole = oldMember.roles.cache.some(
    (role) => role.id === env.DISCORD_CLIENT_ROLE_ID
  );
  const hasClientRole = newMember.roles.cache.some(
    (role) => role.id === env.DISCORD_CLIENT_ROLE_ID
  );

  if (!hadClientRole && hasClientRole) {
    console.log("Tem o cargo");
  } else if (hadClientRole && !hasClientRole) {
    console.log("Não tem o cargo");
  }
});

discord.init();
