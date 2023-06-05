import { HighClient, BaseEvent } from "../util/objects.js";
import { dirname, importx } from "@discordx/importer";
import { BaseEventDataResolvable } from "../util/types.js";
import { glob } from "glob";

import * as http from "http";
import express, { Express } from "express";
import bodyParser from "body-parser";
import {
    Response, Params, Controller, Get,
    attachControllers, Middleware
  } from "@decorators/express";
  

export class ServerHandler
{
    private readonly _app: Express;
    private _server!: http.Server;

    get app(): Express {
        return this._app;
    }
    constructor() {
        this._app = express();

        this._app.set("port", process.env["PORT"] || 3000);

        this._app.use(bodyParser.json());
        this._app.use(bodyParser.urlencoded({ extended: true }));

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
