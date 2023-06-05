import { HighClient } from "../util/objects";
import { Client, CommandInteraction } from "discord.js";
// import { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, Modal, TextInputComponent } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

module.exports = {
  name: "help",
  description: "Shows what you need to know about the bot",
  type: "CHAT_INPUT",
  build: new SlashCommandBuilder().setName("help").setDescription("test"), // https://discordjs.guide/interactions/registering-slash-commands.html
  exec: async (interaction: CommandInteraction, client: HighClient) => {
/*    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('primary')
          .setLabel('Primary')
          .setStyle('PRIMARY'),
      );
    const altVerifyText = new TextInputComponent()
      .setStyle('SHORT')
      .setCustomId('test')
      .setLabel('What is the meaning of life')
      .setMinLength(1)
      .setMaxLength(100)
      .setPlaceholder('42')
      .setRequired(true)

    const modalRow = new MessageActionRow()
      .addComponents(altVerifyText)

    const submissionModal = new Modal()
      .setCustomId('modalTest')
      .setTitle('Very Important')
      .addComponents(modalRow)
      */
    await interaction.reply({ content: 'Pong!' });
  },
};
