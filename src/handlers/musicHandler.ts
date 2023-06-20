import { HighClient } from "../util/objects.js";
import { GatewayDispatchEvents } from "discord.js";
import * as Lava from "@discordx/lava-player";
import { Client, MetadataStorage } from "discordx";
import { Events, GatewayIntentBits, IntentsBitField } from "discord.js";

import "dotenv/config";

export class MusicHandler
{
    /* if we're all making local copies, why not have this global? */
    // private _hClient: HighClient;
    private client: Client;

    constructor(hClient: HighClient)
    {
        this.client = hClient.client;

        this.node = new Lava.Node(
            { host:
                { address: process.env["LAVA_HOST"] ?? ""
                , port: Number(process.env["LAVA_PORT"]) ?? 2333
                }
            , password: process.env["LAVA_PASSWORD"] ?? ""

            , send(guildId, packet)
                {
                    const guild = hClient.client.guilds.cache.get(guildId);
                    if(guild)
                        guild.shard.send(packet);
                }
            , userId: this.client.user?.id ?? "" // the user id of your bot
            });
    }

    /* fuck this language i dont know what type  dashjbdjahsbdaHARRGGHGH */
    private node: any;

    async run()
    {
        this.client.ws.on(GatewayDispatchEvents.VoiceStateUpdate, (data: Lava.VoiceStateUpdate) =>
        {
            this.node.voiceStateUpdate(data);
        });

        this.client.ws.on(GatewayDispatchEvents.VoiceServerUpdate, (data: Lava.VoiceServerUpdate) =>
        {
            this.node.voiceServerUpdate(data);
        });
    }
}
