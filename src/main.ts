import { HighClient } from "./util/objects";
const highClient = new HighClient(new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]}));
const { Events, GatewayIntentBits, IntentsBitField } = require('discord.js');
const { LavaPlayerPlugin } = require("@discordx/plugin-lava-player");
const { Client, MetadataStorage } = require("discordx");
const chalk = require("chalk")
require('dotenv/config');

const lavaPlayerPlugin = new LavaPlayerPlugin({
	metadata: MetadataStorage.instance,
});

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildMessageReactions,
		IntentsBitField.Flags.GuildVoiceStates,
	],
	plugins: [ lavaPlayerPlugin ],
});

highClient.client.once(Events.ClientReady, (c: typeof Client) => {
	console.log(`${chalk.yellow("✨ Ready")}, logged in as ${chalk.blue(c.user.username)}`);
});

if(process.env["TOKEN"] === undefined)
	throw "set client token w/ $TOKEN (including the \"Bot \")";
else
	highClient.client.login(process.env["TOKEN"]);

