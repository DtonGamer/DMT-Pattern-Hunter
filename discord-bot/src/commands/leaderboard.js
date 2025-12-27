/**
 * Slash Command - View Leaderboard
 */

import { SlashCommandBuilder  } from 'discord.js';
import EmbedHelper from '../helpers/embed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View the pattern discovery leaderboard')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Leaderboard type')
        .setRequired(false)
        .addChoices(
          { name: 'discoverers', value: 'discoverers' },
          { name: 'patterns', value: 'patterns' }
        ))
    .addIntegerOption(option =>
      option.setName('limit')
        .setDescription('Number of entries to show (default: 10)')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(20)),

  async execute(interaction, contract, db) {
    await interaction.deferReply();

    try {
      const type = interaction.options.getString('type') || 'discoverers';
      const limit = interaction.options.getInteger('limit') || 10;
      const userId = interaction.user.id;

      db.updateLastActive(userId);

      const users = await contract.getLeaderboard(type);

      if (users.length === 0) {
        const infoEmbed = EmbedHelper.createInfoEmbed(
          'Leaderboard Empty',
          'No one has made any discoveries yet. Be the first!'
        );
        return await interaction.editReply({ embeds: [infoEmbed] });
      }

      const topUsers = users.slice(0, limit);

      const fields = topUsers.map((user, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
        const tierEmoji = user.tier === 'verified' ? '✅' :
                         user.tier === 'trusted' ? '🔒' : '👤';
        const address = user.address.substring(0, 18);

        return {
          name: `${medal} ${tierEmoji} ${address}...`,
          value: `Discoveries: ${user.discoveries} | Reputation: ${user.reputation}`,
          inline: false
        };
      });

      const embed = new EmbedBuilder()
        .setColor('#ffd700')
        .setTitle(`🏆 Leaderboard - Top ${type === 'discoverers' ? 'Discoverers' : 'Patterns'}`)
        .setDescription(`Showing top ${limit} of ${users.length} total`)
        .addFields(fields)
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('[Leaderboard Command] Error:', error);

      const errorEmbed = EmbedHelper.createErrorEmbed(
        'Failed to Load Leaderboard',
        'Could not load leaderboard data. Please try again.'
      );

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};
