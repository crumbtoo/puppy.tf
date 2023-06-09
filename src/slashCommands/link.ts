import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { tsyringeDependencyRegistryEngine } from "@discordx/di";
import { container, injectable, singleton } from "tsyringe";
import { Discord, Slash, SlashChoice, SlashOption, DIService } from "discordx";
import { PrismaClient } from "@prisma/client";
import { DatabaseHandler } from "../handlers/databaseHandler";
import { InjectPrismaClient } from "../util/objects";

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
      description: "Name of your account",
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
        tf2Name: name
      },
      create: {
        id: interaction.user.id,
        tf2Name: name
      },
    });
    await interaction.reply(`${game}`);
  }
}