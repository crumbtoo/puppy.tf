import { glob } from "glob";
import { PrismaClient } from "@prisma/client";
import * as http from "http";
import express, { Express, NextFunction } from "express";
import bodyParser from "body-parser";
import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import rateLimit from "express-rate-limit";
import { uid } from "uid/secure";

import {
    Response, Params, Controller, Get,
    attachControllers, ERROR_MIDDLEWARE 
  } from "@decorators/express"; 

import { Container } from "@decorators/di";
import { ServerErrorMiddleware } from "../util/objects";

export class ServerHandler
{
    private readonly _app: Express;
    private _server!: http.Server;

    get app(): Express {
        return this._app;
    }
    constructor(prisma: PrismaClient) {
        this._app = express();

        this._app.set("port", process.env["PORT"] || 3000);

        this._app.use(bodyParser.json());
        this._app.use(bodyParser.urlencoded({ extended: true }));
        this._app.use(rateLimit({
            windowMs: 120, // 2 minutes
            max: 30, // 30 requests every windowMs
            standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
            legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        }));

        this._app.set("prisma", prisma);

        this.app.use(
            expressSession({
                cookie: {
                maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
                sameSite: true
                },
                secret: uid(32),
                resave: true,
                saveUninitialized: true,
                store: new PrismaSessionStore(
                    new PrismaClient(),
                    {
                        checkPeriod: 2 * 60 * 1000,  //ms
                        dbRecordIdIsSessionId: true,
                        dbRecordIdFunction: undefined,
                    }
              )
            })
          );

          Container.provide([
            { provide: ERROR_MIDDLEWARE, useClass: ServerErrorMiddleware }
          ]);
        

        // CORS
        this.app.use(function (req, res, next) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");
            next();
        });
    }

    async run() {
        const controllers = await glob(`src/controllers/*.ts`);
        const controllerArray: Array<any> = [];

        for (const path of controllers) {
           const result = await import(`../../${path}`);
           controllerArray.push(result.NewController);
        };

        attachControllers(this._app, controllerArray);
        this._server = this._app.listen(this._app.get("port"), () => {
            console.log("🚀 Server is running on port " + this._app.get("port"));
        });
    }

}
