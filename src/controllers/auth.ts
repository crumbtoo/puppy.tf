import {
    Response, Params, Controller, Get,
    attachControllers, Middleware, Query
  } from "@decorators/express";
  
import fetch from "node-fetch";

const redirectURL = "https://discord.com/api/oauth2/authorize?client_id=1115023572855951530&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fsuccess&response_type=code&scope=guilds%20identify";

@Controller("/auth")
export class NewController {
  constructor() {

  }

  @Get("/")
  authAttempt(@Response() res: any, @Params("id") id: string) {
    res.redirect(redirectURL);
  }

  @Get("/success")
  async authSuccess(@Response() res: any, @Query("code") code: string) {
    const fragment = new URLSearchParams(code);
		const [accessToken, tokenType] = [fragment.get("access_token"), fragment.get("token_type")];
    console.log(accessToken);
    const response = await fetch("https://discord.com/api/users/@me", {
			headers: {
				authorization: `${tokenType} ${accessToken}`,
			},
		});
    const jsonify: any = await response.json();
    console.log(jsonify);
    res.send("ye");
  }
}