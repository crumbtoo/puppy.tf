// pre-made embeds

import { EmbedBuilder } from "discord.js";

export function ErrorEmbed(desc?: string): EmbedBuilder {
    return new EmbedBuilder()
        .setColor("#cf2727") // [207, 39, 39]
        .setTitle("Error")
        .setDescription(desc ?? "An error occured.");
}
