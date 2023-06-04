// declare var require: any;
// declare var process: any;

// import { Client } from "discordx"
const { Client, Events, GatewayIntentBits } = require('discord.js');
const chalk = require("chalk")
require('dotenv/config');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (c: typeof Client) => {
	console.log(`${chalk.yellow("✨ Ready")}, logged in as ${chalk.blue(c.user.username)}`);
});

if(process.env["TOKEN"] === undefined)
	throw "set client token w/ $TOKEN (including the \"Bot \")";
else
	client.login(process.env["TOKEN"]);

