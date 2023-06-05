import { HighClient } from "../util/objects";
import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashChoice, SlashOption } from "discordx";

@Discord()
class Example {
    @Slash({ description: "choose1" })
    choose1
    (
        @SlashChoice({ name: "are you okay?", value: "okay" })
        @SlashChoice({ name: "are you good?", value: "good" })
        @SlashOption(
            { description: "what1"
            , name: "what1"
            , required: true
            , type: ApplicationCommandOptionType.String
            })
        what: string,
        interaction: CommandInteraction
    ): void {
        interaction.reply(what);
    }
}

