import { HighClient } from "./util/objects";
import { Client, MetadataStorage } from "discordx";
import { Events, GatewayIntentBits, IntentsBitField } from 'discord.js';

const chalk = require("chalk");

require('dotenv/config');



const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMessageReactions,
		IntentsBitField.Flags.GuildVoiceStates,
	],
//	plugins: [ lavaPlayerPlugin ],
});
const highClient = new HighClient(client);

if(process.env["TOKEN"] === undefined)
	throw "set client token w/ $TOKEN (including the \"Bot \")";
else
	highClient.client.login(process.env["TOKEN"]);
	require("./handlers/slashHandler")(highClient, process.env);
	require("./handlers/eventHandler")(highClient);

