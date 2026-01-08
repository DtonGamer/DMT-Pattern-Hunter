/**
 * Slash Command - View Recent Discoveries
 */

import { SlashCommandBuilder  } from 'discord.js';
import EmbedHelper from '../helpers/embed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('discovery')
    .setDescription('View recent pattern discoveries')
    .addIntegerOption(option =>
      option.setName('limit')
        .setDescription('Number of discoveries to show (default: 20)')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(50)),

  async execute(interaction, contract, db) {
    await interaction.deferReply();

    try {
      const limit = interaction.options.getInteger('limit') || 20;
      const userId = interaction.user.id;

      db.updateLastActive(userId);

      // Check if contract is available before getting discoveries
      if (!contract) {
        const infoEmbed = EmbedHelper.createInfoEmbed(
          'Scanner Offline',
          'The discovery system is currently offline. Please try again later.\n\n' +
          'You can still use other commands like /reputation, /scan, and /link while we work on the system.'
        );
        return await interaction.editReply({ embeds: [infoEmbed] });
      }

      const discoveries = await contract.getRecentDiscoveries(limit);

      if (discoveries.length === 0) {
        const infoEmbed = EmbedHelper.createInfoEmbed(
          'No Discoveries Yet',
          'No patterns have been discovered yet. Be the first to scan and discover a pattern!'
        );
        return await interaction.editReply({ embeds: [infoEmbed] });
      }

      const fields = discoveries.map((discovery, i) => {
        const emoji = discovery.stats?.rarity === 'EXTREMELY RARE' ? '💎' :
                       discovery.stats?.rarity === 'RARE' ? '⭐' :
                       discovery.stats?.rarity === 'MODERATE' ? '📊' : '📋';

        return {
          name: `${i + 1}. ${emoji} ${discovery.pattern}`,
          value: `Field: ${discovery.field}\n` +
                 `Rarity: ${discovery.stats?.rarity || 'Unknown'}\n` +
                 `Discoverer: \`${discovery.discoverer}\`\n` +
                 `At: ${new Date(discovery.timestamp).toLocaleString()}`,
          inline: false
        };
      });

      const embed = new EmbedBuilder()
        .setColor('#00ccff')
        .setTitle('📊 Recent Discoveries')
        .setDescription(`Showing ${discoveries.length} recent discoveries`)
        .addFields(fields.slice(0, 10))
        .setTimestamp();

      if (discoveries.length > 10) {
        embed.setFooter({ text: `Showing first 10 of ${discoveries.length} discoveries` });
      }

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('[Discovery Command] Error:', error);

      const errorEmbed = EmbedHelper.createErrorEmbed(
        'Failed to Load Discoveries',
        'Could not load recent discoveries. Please try again.'
      );

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};
