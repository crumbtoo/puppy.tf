import { dirname, importx } from "@discordx/importer";
import { HighClient } from "./util/objects.js";
import { Client, MetadataStorage, } from "discordx";
import { Events, GatewayIntentBits, IntentsBitField } from 'discord.js';

import chalk from "chalk";

import { eventHandler } from "./handlers/eventHandler.js";
import { slashHandler } from "./handlers/slashHandler.js";

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
async function main() {
    if(process.env["TOKEN"] === undefined)
        throw "set client token w/ $TOKEN (including the \"Bot \")";
    else
    {
    //  slashHandler(highClient, process.env);
        highClient.client.login(process.env["TOKEN"]);

        client.on("ready", async function() {
            console.log(`${chalk.yellow("✨ Ready")}, logged in`);
            await eventHandler(highClient);
            await slashHandler(highClient);
        });
    }

}
main();