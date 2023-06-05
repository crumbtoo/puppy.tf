import {
    Response, Params, Controller, Get,
    attachControllers, Middleware
  } from "@decorators/express";
  
  const redirectURL = "https://discord.com/api/oauth2/authorize?client_id=1115023572855951530&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fsuccess&response_type=code&scope=guilds%20identify";
  
@Controller("/")
export class NewController {
  constructor() {

  }

  @Get("/user")
  authAttempt(@Response() res: any, @Params("id") id: string) {
    res.redirect(redirectURL);
  }

  @Get("/user/success/:code")
  authSuccess(@Response() res: any, @Params("code") id: string) {
    res.send(id);
  }
}