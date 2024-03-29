import { Client } from "discordx";
import { BaseEventDataResolvable, BaseCommandDataResolvable } from "./types";
import { attachMiddleware, ErrorMiddleware } from "@decorators/express";
import {Request, Response, NextFunction} from "express";
import { PrismaClient } from "@prisma/client";
import { singleton } from "tsyringe";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import session from "express-session";

import "dotenv/config";

/* maybe doesn't belong here. whatever. */
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const redirectURL: string =
    (function ()
    {
        const x = process.env["REDIRECT_URL"];
        if(x === undefined)
            throw "define $REDIRECT_URL";
        else
            return x;
    })();

declare module "express-session" {
  export interface SessionData {
    token: string,
    type: string
  }
} // overload sessiondata to get expected values


// Check for authorization
export function Authorization(fetch: Function) {
    return function (target: any, propertyKey: string) {
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
                res.redirect(redirectURL); // presumably unauthorized
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

@singleton()
export class InjectPrismaClient extends PrismaClient {}
