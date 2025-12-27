/**
 * Slash Command - View My Scans
 */

import { SlashCommandBuilder  } from 'discord.js';
import EmbedHelper from '../helpers/embed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('myscans')
    .setDescription('View your recent scan history')
    .addIntegerOption(option =>
      option.setName('limit')
        .setDescription('Number of scans to show (default: 10)')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(25)),

  async execute(interaction, contract, db) {
    await interaction.deferReply();

    try {
      const limit = interaction.options.getInteger('limit') || 10;
      const userId = interaction.user.id;

      const user = db.getOrCreateUser(userId);
      const tier = user.tier;

      db.updateLastActive(userId);

      const scans = db.getRecentScans(userId, limit);

      const embed = EmbedHelper.createMyScansEmbed(scans, tier);

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('[MyScans Command] Error:', error);

      const errorEmbed = EmbedHelper.createErrorEmbed(
        'Failed to Load Scans',
        'Could not load your scan history. Please try again.'
      );

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};
