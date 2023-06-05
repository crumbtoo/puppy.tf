import { dirname, importx } from "@discordx/importer";
import { HighClient } from "./util/objects.js";
import { Client, MetadataStorage, } from "discordx";
import { Events, GatewayIntentBits, IntentsBitField } from 'discord.js';

import chalk from "chalk";

import { EventHandler } from "./handlers/eventHandler.js";
import { SlashHandler } from "./handlers/slashHandler.js";

import 'dotenv/config';

const client = new Client({
    intents:
        [ IntentsBitField.Flags.Guilds
        , IntentsBitField.Flags.GuildMessageReactions
        , IntentsBitField.Flags.GuildVoiceStates
        ]
    , botId: "1115023572855951530"
    , botGuilds: true ? ["1115027642148732968"] : undefined
    });

const highClient = new HighClient(client);
const eventHandler = new EventHandler(highClient);
const slashHandler = new SlashHandler(highClient);

async function main() {
    if(process.env["TOKEN"] === undefined)
        throw "set client token w/ $TOKEN (including the \"Bot \")";
    else
    {
        await slashHandler.run();
        await eventHandler.run();

        highClient.client.login(process.env["TOKEN"]);

        client.once("ready", async function() {
            console.log(`${chalk.yellow("✨ Ready")}, logged in`);
            await client.initApplicationCommands();
        });

        client.on(Events.InteractionCreate, (interaction) => {
            client.executeInteraction(interaction);
        });
    }

}
main();