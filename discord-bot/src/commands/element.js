/**
 * Slash Command - Check Element Availability
 */

import { SlashCommandBuilder  } from 'discord.js';
import EmbedHelper from '../helpers/embed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('element')
    .setDescription('Check if an element is available')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Element name (e.g., "lucky")')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('pattern')
        .setDescription('Pattern (e.g., "69")')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('field')
        .setDescription('Field number (0-37)')
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(37)),

  async execute(interaction, contract, db) {
    await interaction.deferReply();

    try {
      const name = interaction.options.getString('name');
      const pattern = interaction.options.getString('pattern');
      const field = interaction.options.getInteger('field') || 16;

      const userId = interaction.user.id;
      db.updateLastActive(userId);

      const check = await contract.checkElementAvailability(name, pattern, field);

      const embed = EmbedHelper.createElementAvailabilityEmbed(check);

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('[Element Command] Error:', error);

      const errorEmbed = EmbedHelper.createErrorEmbed(
        'Element Check Failed',
        'Failed to check element availability. Please try again.'
      );

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};
