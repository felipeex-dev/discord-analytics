import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { env } from "../environment";
import { CreateMember } from "./member/create-member";

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
        body: [],
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

discord.on("ready", () => {
  console.log("Discord BOT started!");
});

discord.on("guildMemberAdd", (member) => {
  CreateMember(member);
});
