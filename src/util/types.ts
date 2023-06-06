import internal from "stream";
import { HighClient } from "./objects";
import { Message } from "discord.js";

export interface BaseCommandDataResolvable {
    name: string;
    source: string;
}

export interface BaseEventDataResolvable {
    source: string;
}

export interface OAuthResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string
}