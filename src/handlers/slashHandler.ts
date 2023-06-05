import { Routes } from "discord-api-types/v9";
import { REST } from "@discordjs/rest";
import 'dotenv/config';
import { HighClient } from "../util/objects";
import { CommandInteraction, CacheType, InteractionType } from "discord.js";

import { ContextMenuCommandBuilder } from "@discordjs/builders";

import { glob } from "glob";

module.exports = async (highClient: HighClient, token: string) => {
    const rest = new REST({ version: "9" }).setToken(token);
    const commandObj: {
        [x: string]:
        { exec: (arg0: CommandInteraction<CacheType>, arg1: HighClient) => void; };
    } = {};

    const commandArray: Array<string> = [];
    const slashCommands = await glob(`src/slashCommands/*.ts`);

    slashCommands.forEach((path: string) => {
        const req = require(`${process.cwd()}/${path}`);
        commandObj[req.name] = req;
        commandArray.push(req.build.toJSON());
        console.log("Command loaded");
    });

    try {
        await rest.put(Routes.applicationGuildCommands("1115023572855951530", "1115027642148732968"), {
          body: commandArray,
        });
        console.log("Commands loaded");
      } catch (e) {
        throw e;
      }

    highClient.client.on("interactionCreate", async (interaction) => {
        console.log(interaction);
        if (interaction.type === InteractionType.ApplicationCommand) {
            try {
                commandObj[interaction.commandName].exec(interaction, highClient);
            } catch (e) {
                console.warn(e);
            }
        }
    });

};