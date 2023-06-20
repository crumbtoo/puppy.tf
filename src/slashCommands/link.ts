import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { tsyringeDependencyRegistryEngine } from "@discordx/di";
import { container, injectable, singleton } from "tsyringe";
import { Discord, Slash, SlashChoice, SlashOption, DIService } from "discordx";
import { PrismaClient } from "@prisma/client";
import { DatabaseHandler } from "../handlers/databaseHandler";
import { InjectPrismaClient } from "../util/objects";
// import { GameStats } from "../util/commands/gameStats"; 

@Discord()
@injectable() // for di injection
export class Link {
  constructor(private readonly prismaClient: InjectPrismaClient) {}

  @Slash({ description: "Link a game account to puppy. ", name: "link" })
  async link(  
    @SlashChoice({ name: "Team Fortress 2", value: "tf2" })
    @SlashChoice({ name: "Counter-Strike: Global Offensive", value: "csgo" })
    @SlashChoice({ name: "Rainbow Six Siege", value: "r6s" })
    @SlashOption({
      description: "The game to link puppy to.",
      name: "game",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    game: string,

    @SlashOption({
      description: "Name of your account. For Team Fortess 2 and Counter-Strike, this should be your Steam account's vanity URL identifier or your Steam ID. As an example, if your URL was `https://steamcommunity.com/id/example/`, you would use `example`.",
      name: "name",
      required: true,
      type: ApplicationCommandOptionType.String,
    })  
    name: string,
    
    interaction: CommandInteraction
  ): Promise<void> {
    await this.prismaClient.user.upsert({
      where: {
        id: interaction.user.id,
      },
      update: {
        [game]: name
      },
      create: {
        id: interaction.user.id,
        [game]: name
      },
    });
    await interaction.reply("Successfully linked!");
  }
}