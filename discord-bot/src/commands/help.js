/**
 * Slash Command - Help
 */

import { SlashCommandBuilder  } from 'discord.js';
import EmbedHelper from '../helpers/embed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display all available commands'),

  async execute(interaction, contract, db) {
    await interaction.deferReply();

    try {
      const userId = interaction.user.id;
      db.updateLastActive(userId);

      const embed = EmbedHelper.createHelpEmbed();

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('[Help Command] Error:', error);

      const errorEmbed = EmbedHelper.createErrorEmbed(
        'Failed to Load Help',
        'Could not load command help. Please try again.'
      );

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};
