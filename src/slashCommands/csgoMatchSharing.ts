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
export class MatchSharing {
  constructor(private readonly prismaClient: InjectPrismaClient) {}

  @Slash({ description: "Authorize puppy to get more information about your gameplay. Reqs. a linked CSGO account.", name: "csgo-match-sharing" })
  async matchsharing(  
    
    interaction: CommandInteraction
  ): Promise<void> {

    await interaction.reply("Successfully linked!");
  }
}