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
    constructor(highClient: HighClient, source: string) {
        this._source = source;

        let eventFileReq = require(source);
        this._exports = {
           run: eventFileReq.exec,
           reload: async () => {
                try {
                    delete require.cache[this._source];
                    eventFileReq = require(this._source);

                    return Promise.resolve(true);
                } catch(e) { return Promise.reject(e); }
            }
        };
        
        highClient.client.on(eventFileReq.name, (...args: any[]) => {
            this._exports.run(highClient, ...args);
        });

    }

    private readonly _source: string;
    readonly _exports: {
        run: (...args: unknown[]) => void;
        reload: () => void
    };
}

export class BaseCommand {

}