import "reflect-metadata";

import { dirname, importx } from "@discordx/importer";
import { HighClient } from "./util/objects.js";
import { Client, MetadataStorage, DIService, tsyringeDependencyRegistryEngine } from "discordx";
import { Events, GatewayIntentBits, IntentsBitField } from "discord.js";

import { container, instanceCachingFactory  } from "tsyringe";

import chalk from "chalk";

import { EventHandler } from "./handlers/eventHandler.js";
import { SlashHandler } from "./handlers/slashHandler.js";
import { ServerHandler } from "./handlers/serverHandler.js";
import { DatabaseHandler } from "./handlers/databaseHandler.js";
import { MusicHandler } from "./handlers/musicHandler.js";

tsyringeDependencyRegistryEngine.setToken(Symbol());
DIService.engine = tsyringeDependencyRegistryEngine
  .setUseTokenization(true)
  .setCashingSingletonFactory(instanceCachingFactory)
  .setInjector(container);


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
          // inject prisma client into the fucking thingamajig

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

