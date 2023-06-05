import { Routes } from "discord-api-types/v9";
import { REST } from "@discordjs/rest";
import 'dotenv/config';
import { HighClient } from "../util/objects.js";
import { CommandInteraction, CacheType, InteractionType } from "discord.js";

import { dirname, importx } from "@discordx/importer";

export class SlashHandler
{
    async run() {
        await importx(`${dirname(import.meta.url)}/../slashCommands/**/*.{ts,js}`)
    }
    async reload(name: string) {
        await importx(`${dirname(import.meta.url)}/../slashCommands/**/${name}.{ts,js}`);
    }
    private _hClient: HighClient;
    constructor(hClient: HighClient) {
        this._hClient = hClient;
    }
}
