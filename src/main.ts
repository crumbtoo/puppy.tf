import { dirname, importx } from "@discordx/importer";
import { HighClient } from "./util/objects.js";
import { Client, MetadataStorage } from "discordx";
import { Events, GatewayIntentBits, IntentsBitField } from 'discord.js';

// import "chalk";

// import { eventHandler } from "./handlers/eventHandler.js";
// import { slashHandler } from "./handlers/slashHandler.js";

// require('dotenv/config');

const client = new Client({
    intents:
        [ IntentsBitField.Flags.Guilds
        , IntentsBitField.Flags.GuildMessageReactions
        , IntentsBitField.Flags.GuildVoiceStates
        ]
    , botId: "895201505198616576"
    , botGuilds: true ? ["867598108813033474"] : undefined
});

const highClient = new HighClient(client);

if(process.env["TOKEN"] === undefined)
    throw "set client token w/ $TOKEN (including the \"Bot \")";
else
{
    client.once("ready", async () =>
    {
        await client.initApplicationCommands();
    });

    client.on("interactionCreate", (interaction) =>
    {
        client.executeInteraction(interaction);
    });

    await importx(`${dirname(import.meta.url)}/{events,slashCommands}/**/*.{ts,js}`);
    // slashHandler(highClient, process.env);
    // eventHandler(highClient);
    highClient.client.login(process.env["TOKEN"]);
}

