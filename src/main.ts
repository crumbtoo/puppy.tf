// declare var require: any;
// declare var process: any;

// import { Client } from "discordx"
const { Client, Events, GatewayIntentBits } = require('discord.js');
const chalk = require("chalk");
require('dotenv/config');

import { HighClient } from "./util/objects";
const highClient = new HighClient(new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]}));

if(process.env["TOKEN"] === undefined)
	throw "set client token w/ $TOKEN (including the \"Bot \")";
else
	highClient.client.login(process.env["TOKEN"]);
	require("./handlers/slashHandler")(highClient, process.env["TOKEN"]);
	require("./handlers/eventHandler")(highClient);

