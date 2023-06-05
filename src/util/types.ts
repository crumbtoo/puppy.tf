import { HighClient } from "./objects";
import { Message } from "discord.js";

export interface BaseCommandDataResolvable {
    name: string;
    
    source: string;
}

export interface BaseEventDataResolvable {
    name: string,
    source: string;
}