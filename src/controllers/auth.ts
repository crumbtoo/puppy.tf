import {
    Response, Params, Controller, Get, Request,
    attachControllers, Middleware, Query
  } from "@decorators/express";
  
import fetch from "node-fetch";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

import { OAuthResponse } from "../util/types.js";

import { redirectURL } from "../util/objects.js";

@Controller("/auth")
export class NewController {
  constructor(private prisma: PrismaClient) {

  }

  @Get("/")
      // #swagger.tags = ['Misc']
    // #swagger.summary = 'Checks if a user is a member of the Devforum'
    // #swagger.description = 'This accepts the name of the user (name parameter) and checks to see if the user is a member of the Devforum. If the user does not have a Devforum account, this will return an error code 0. A member is a user who has the ability to post on the Devforum. This is achieved by around 3 hours of reading time.'
    // #swagger.produces = ['application/json']
    /* #swagger.parameters['name'] = {
        in: 'path',
        description: 'Name of the user',
        required: true
    } 
    */
    /*
    #swagger.responses[200] = {
      description: 'Indicates a succesful response',
      schema: {
        error: false,
        data: {
          member: true,
        },
      },
    };
    */
  authAttempt(@Response() res: any, @Params("id") id: string) {
    // #swagger.tags = ['Misc']
    // #swagger.summary = 'Checks if a user is a member of the Devforum'
    // #swagger.description = 'This accepts the name of the user (name parameter) and checks to see if the user is a member of the Devforum. If the user does not have a Devforum account, this will return an error code 0. A member is a user who has the ability to post on the Devforum. This is achieved by around 3 hours of reading time.'
    // #swagger.produces = ['application/json']
    /* #swagger.parameters['name'] = {
        in: 'path',
        description: 'Name of the user',
        required: true
    } 
    */
    /*
    #swagger.responses[200] = {
      description: 'Indicates a succesful response',
      schema: {
        error: false,
        data: {
          member: true,
        },
      },
    };
    */
    res.redirect(redirectURL);
  }

  @Get("/success")
  async authSuccess(@Request() req: any, @Response() res: any, @Query("code") code: string) {
    const clientId: string = process.env["CLIENTID"]!;
    const clientSecret: string = process.env["CLIENTSECRET"]!;
    const tokenResponseData = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: `http://localhost:3000/auth/success`,
        scope: "identify",
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const oauthData: any = await tokenResponseData.json(); 
    if (oauthData instanceof Object && oauthData.token_type && oauthData.access_token) {
      req.session.token = oauthData.access_token;
      req.session.type = oauthData.token_type;
    } else {
      res.status(403);
    }
    res.send("Success");
	}
}
