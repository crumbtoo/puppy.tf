import { dirname, importx } from "@discordx/importer";
import { HighClient } from "./util/objects.js";
import { Client, MetadataStorage, } from "discordx";
import { Events, GatewayIntentBits, IntentsBitField } from "discord.js";

import chalk from "chalk";

import { EventHandler } from "./handlers/eventHandler.js";
import { SlashHandler } from "./handlers/slashHandler.js";
import { ServerHandler } from "./handlers/serverHandler.js";
import { DatabaseHandler } from "./handlers/databaseHandler.js";
import { MusicHandler } from "./handlers/musicHandler.js";

import "dotenv/config";

const client = new Client({
    intents:
        [ IntentsBitField.Flags.Guilds
        , IntentsBitField.Flags.GuildMessageReactions
        , IntentsBitField.Flags.GuildVoiceStates
        ]
    , botId: process.env["CLIENTID"] ?? undefined
    , botGuilds: process.env["GUILD"] ? [ process.env["GUILD"] ] : undefined
});

const highClient = new HighClient(client);

const eventHandler = new EventHandler(highClient); // for bot events
const slashHandler = new SlashHandler(highClient); // for bot slash commands
const databaseHandler = new DatabaseHandler(); // for prisma
const serverHandler = new ServerHandler(databaseHandler.pClient); // for express server
const musicHandler = new MusicHandler(highClient); // i dont use comments

async function main() {
    if(process.env["TOKEN"] === undefined)
        throw "set client token w/ $TOKEN (including the \"Bot \")";
    else
    {
        const prismaClient = databaseHandler.pClient;
        await slashHandler.run();
        await eventHandler.run();
        await serverHandler.run();
        await musicHandler.run();

        highClient.client.login(process.env["TOKEN"]);

        client.once("ready", async function() {
            console.log(`${chalk.yellow("✨ Ready")}, logged in to bot`);
            await client.initApplicationCommands();
        });

        client.on(Events.InteractionCreate, (interaction) => {
            client.executeInteraction(interaction);
        });
    }

}
main();

