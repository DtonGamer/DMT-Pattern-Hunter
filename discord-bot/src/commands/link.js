/**
 * Slash Command - Link Bitcoin Address
 */

import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle  } from 'discord.js';
import EmbedHelper from '../helpers/embed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('link')
    .setDescription('Link your Bitcoin address to your Discord account')
    .addStringOption(option =>
      option.setName('address')
        .setDescription('Your Bitcoin address (starts with bc1...)')
        .setRequired(true)),

  async execute(interaction, contract, db) {
    await interaction.deferReply();

    try {
      const userId = interaction.user.id;
      const address = interaction.options.getString('address');

      if (!address.startsWith('bc1')) {
        const errorEmbed = EmbedHelper.createErrorEmbed(
          'Invalid Address',
          'Bitcoin addresses must start with "bc1". Please check your address.'
        );
        return await interaction.editReply({ embeds: [errorEmbed] });
      }

      const existingUser = db.getUserByAddress(address);

      if (existingUser && existingUser.discord_id !== userId) {
        const errorEmbed = EmbedHelper.createErrorEmbed(
          'Address Already Linked',
          'This Bitcoin address is already linked to another Discord account.'
        );
        return await interaction.editReply({ embeds: [errorEmbed] });
      }

      db.linkAddress(userId, address);

      const successEmbed = EmbedHelper.createSuccessEmbed(
        'Address Linked',
        `Your Bitcoin address has been linked to your Discord account.\n\n` +
        `**Address:** \`${address}\`\n` +
        `**Discord ID:** \`${userId}\`\n\n` +
        `💡 You can now earn reputation and upgrade your tier by discovering patterns!`
      );

      await interaction.editReply({ embeds: [successEmbed] });

    } catch (error) {
      console.error('[Link Command] Error:', error);

      const errorEmbed = EmbedHelper.createErrorEmbed(
        'Link Failed',
        'Failed to link your Bitcoin address. Please try again.'
      );

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};
