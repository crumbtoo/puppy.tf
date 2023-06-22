import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { container, injectable, singleton } from "tsyringe";
import { Discord, Slash, SlashChoice, SlashOption, DIService } from "discordx";
import { PrismaClient } from "@prisma/client";
import { DatabaseHandler } from "../handlers/databaseHandler";
import fetch from "node-fetch";
import { InjectPrismaClient } from "../util/objects";
import { ErrorEmbed } from "../util/commands/embeds";
import r6s from "r6s-stats-api";
import { resolveVanityUrl, GameId } from "../util/commands/gameStats";
import { EmbedBuilder } from "discord.js";
import "dotenv/config";

@Discord()
@injectable() // for di injection
export class Stats {
  constructor(private readonly prismaClient: InjectPrismaClient) {}

  @Slash({ description: "Get the stats for a game. Ensure that your profile and ", name: "stats" })
  async stats(  
    @SlashChoice({ name: "Team Fortress 2", value: "tf2" })
    @SlashChoice({ name: "Counter-Strike: Global Offensive", value: "csgo" })
    @SlashChoice({ name: "Rainbow Six Siege", value: "r6s" })
    @SlashOption({
      description: "The game to get stats for",
      name: "game",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    game: string,

    @SlashOption({
      description: "Name of your account. Optional if you have your account linked",
      name: "name",
      required: false,
      type: ApplicationCommandOptionType.String,
    })  
    name: string,

    
    
    interaction: CommandInteraction
  ): Promise<void> {
    let acc: string;
    if (!name) {
      const user: any = await this.prismaClient.user.findUnique({
        where: {
          id: interaction.user.id,
        },
      });
      if (user && user[game]) {
        acc = user[game];
      } else {
        interaction.reply({ embeds: [
          ErrorEmbed("You do not have a linked account for that game and did not provide a value for `name`. Run the `/link` command if you do not want to use `name`.")
        ]});
        return;
      }
    } else {
      acc = name;
    }
    switch (game) {
      case "csgo": {
        const steamId = await resolveVanityUrl(acc);
        if (!steamId) {
          interaction.reply({ embeds: [
            ErrorEmbed("The linked account is invalid. Ensure you have provided a steam ID or a valid vanity URL identifier. This can be found at https://steamcommunity.com/id/**<username>**/.")
          ]});
          return;
        }
        const gameReq = await fetch(`https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v2/?key=${process.env["STEAMKEY"]}&steamid=${steamId}&appid=${GameId.csgo}`);
        const json: any = await gameReq.json();
        const embed = new EmbedBuilder()
        .setColor("#6046d4")
        .setTitle("Counter-Strike: Global Offensive")
        .addFields([
          { name: "Kills", value: json}
        ]);
      } 
      case "tf2": {

      }
      case "r6s": {

      }
    }
  }
}