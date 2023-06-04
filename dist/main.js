"use strict";
// import { Client } from "discordx"
const { Client, Events, GatewayIntentBits } = require('discord.js');
require('dotenv/config');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once(Events.ClientReady, (c) => {
    console.log(`Ready, logged in as ${c.user.name}`);
});
if (process.env["TOKEN"] === undefined)
    throw "set client token w/ $TOKEN (including the \"Bot \")";
else
    client.login(process.env["TOKEN"]);
//# sourceMappingURL=main.js.map