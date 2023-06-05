import { HighClient } from "../util/objects";
import { BaseEventDataResolvable } from "../util/types";

const chalk = require("chalk");
module.exports = {
	name: "ready",
    exec: (highClient: HighClient, ...args: unknown[]) => { 
        console.log(`${chalk.yellow("✨ Ready")}, logged in as ${chalk.blue(highClient.client.user?.username)}`);
    }
};