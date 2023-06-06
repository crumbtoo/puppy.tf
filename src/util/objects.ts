import { Client } from "discordx";
import { BaseEventDataResolvable, BaseCommandDataResolvable } from "./types";
import { attachMiddleware, ErrorMiddleware } from "@decorators/express";
import {Request, Response, NextFunction} from "express";
import fetch from "node-fetch";

import session from "express-session";

export const redirectURL = "https://discord.com/api/oauth2/authorize?client_id=1115023572855951530&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fsuccess&response_type=code&scope=guilds%20identify";

declare module "express-session" {
  export interface SessionData {
    token: string,
    type: string
  }
} // overload sessiondata to get expected values


// Check for authorization
export function Authorization(fetch: Function) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        attachMiddleware(target, propertyKey, (req: Request, res: Response, next: NextFunction) => {
            const session = req.session;
            fetch("https://discord.com/api/users/@me", {
	            headers: {
		            authorization: `${session.type} ${session.token}`,
	            },
            })
            .then(() => next())
            .catch((e: Error) => {
                console.log(e);
                res.redirect(redirectURL);
            });
        });
    };
  }
// Error handler middleware

export class ServerErrorMiddleware implements ErrorMiddleware {
	use(error: Error, req: Request, res: Response, _next: NextFunction) {
		console.log("caught this error", error.message);
		res.status(500);
	}
}

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