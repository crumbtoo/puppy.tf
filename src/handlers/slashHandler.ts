import { Routes } from "discord-api-types/v9";
import { REST } from "@discordjs/rest";
import 'dotenv/config';
import { HighClient } from "../util/objects.js";
import { CommandInteraction, CacheType, InteractionType } from "discord.js";

import { ContextMenuCommandBuilder } from "@discordjs/builders";

import { glob } from "glob";

export async function slashHandler(highClient: HighClient)
{
    await highClient.client.initApplicationCommands();
    return;
   /* const rest = new REST({ version: "9" }).setToken(env["TOKEN"]);
    const commandObj: {
        [x: string]:
        { exec: (arg0: CommandInteraction<CacheType>, arg1: HighClient) => void; };
    } = {};

    const commandArray: Array<string> = [];

    const slashCommands = await glob(`src/slashCommands/*.ts`);
    slashCommands.forEach(async (path: string) => {
        const req = await import(`../${path}`);
        console.log(req);
        console.log(`${path}`);
        commandObj[req.name] = req;
        commandArray.push(req.build.toJSON());
        console.log("Command loaded");
    });

    try {
        await rest.put(Routes.applicationGuildCommands(env["CLIENTID"], env["SERVERID"]), {
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
    }); */

};
