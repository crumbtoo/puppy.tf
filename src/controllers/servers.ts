import {
    Request, Response, Params, Controller, Get,
    attachControllers, Middleware
  } from "@decorators/express";
  
import { PrismaClient } from "@prisma/client";
import { redirectURL, Authorization } from "../util/objects.js";
import fetch from "node-fetch";
import { PermissionsBitField } from "discord.js";

@Controller("/servers")
export class NewController {
  constructor(private prisma: PrismaClient) {

  }

  @Authorization(fetch)
  @Get("/")  
  async seeServers(@Request() req: any, @Response() res: any, @Params("id") id: string) {
    //    const body = await fetched.json();
    // console.log(body);
    // res.send(body);
    console.log(req.session.token);
    const fetched = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        authorization: `${req.session.type} ${req.session.token}`,
      },
    }).catch((e) => {
      console.log(e);
    });
    const json: any = await fetched!.json();
    const filteredServers = json.filter((val: any) => {
      const permissionsField = new PermissionsBitField(BigInt(val.permissions));
      return permissionsField.has(PermissionsBitField.Flags.Administrator);
    });
    res.send(filteredServers);

  }

  @Get("/user/success/:code")
  authSuccess(@Response() res: any, @Params("code") id: string) {
    res.send(id);
  }
}