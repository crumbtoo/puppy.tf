import { HighClient, BaseEvent } from "../util/objects.js";
import { dirname, importx } from "@discordx/importer";
import { BaseEventDataResolvable } from "../util/types.js";
import { glob } from "glob";

export class AuthHandler
{
    async run() {
        await importx(`${dirname(import.meta.url)}/../events/**/*.{ts,js}`);
    }
    async reload(name: string) {
        await importx(`${dirname(import.meta.url)}/../events/**/${name}.{js,ts}`);
    }
    private _hClient: HighClient;

    constructor(hClient: HighClient) {
        this._hClient = hClient;
    }
}
