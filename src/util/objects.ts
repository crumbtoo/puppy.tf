import { Client, Message, Presence } from "discord.js";
import { BaseEventDataResolvable, BaseCommandDataResolvable } from "./types";

// Modifiable version of client that allows for more customization
// Passed to all events and commands
export class HighClient { 
    constructor(discordClient: Client) {
        this._client = discordClient;
    }

    private _client: Client;
    public get client(): Client {
        return this._client;
    }
}


export class BaseEvent {
    constructor(highClient: HighClient, eventData: BaseEventDataResolvable) {
        this._name = eventData.name;
        this._source = eventData.source;

        let exportedRun = require(eventData.source);
        this._exports = {
           run: exportedRun,
           reload: async () => {
                try {
                    delete require.cache[this._source];
                    exportedRun = require(this._source);

                    return Promise.resolve(true);
                } catch(e) { return Promise.reject(e); }
            }
        };
        
        highClient.client.on(this._name, (...args: any[]) => {
            this._exports.run(highClient, ...args);
        });

    }

    private readonly _name: string;
    private readonly _source: string;
    private readonly _exports: {
        run: (...args: unknown[]) => void;
        reload: () => void
    };
}

export class BaseCommand {

}