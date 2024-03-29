import { HighClient } from "../util/objects";
import { BaseEventDataResolvable } from "../util/types";

import chalk from "chalk";

// module.exports = {
// 	name: "ready",
//     exec: (highClient: HighClient, ...args: unknown[]) => { 
//         console.log(`${chalk.yellow("✨ Ready")}, logged in as ${chalk.blue(highClient.client.user?.username)}`);
//     }
// };

import type { ArgsOf, Client } from "discordx";
import { Discord, Once } from "discordx";

@Discord()
export class Example {
    @Once()
    interactionCreate(highClient: HighClient, ...args: unknown[]): void
    {
        console.log(`${chalk.yellow("✨ Ready")}, logged in`);
    }
}

