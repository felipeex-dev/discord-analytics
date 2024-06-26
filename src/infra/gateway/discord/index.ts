import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
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

const commands = [
  { function: addInvite, informations: addInviteCommand },
  { function: reloadInvites, informations: reloadInviteCommand },
];

export class DiscordBOT extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildInvites,
      ],
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
discord.init();

discord.on("ready", async () => {
  console.log("Discord BOT started!");
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
