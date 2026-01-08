/**
 * Slash Command - Manage Notifications
 */

import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import EmbedHelper from '../helpers/embed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('notifications')
    .setDescription('Enable or disable rare pattern notifications'),

  async execute(interaction, contract, db, config) {
    await interaction.deferReply();

    try {
      const userId = interaction.user.id;
      const guildId = interaction.guildId;
      const channelId = interaction.channelId;

      if (!config.discord?.permissions?.askForAnnouncementPermission) {
        const errorEmbed = EmbedHelper.createErrorEmbed(
          'Notifications Disabled',
          'Announcement notifications are currently disabled in bot configuration.'
        );
        return await interaction.editReply({ embeds: [errorEmbed] });
      }

      const user = db.getOrCreateUser(userId);

      const enableButton = new ButtonBuilder()
        .setCustomId(`notify_enable_${userId}`)
        .setLabel('✅ Enable')
        .setStyle(ButtonStyle.Success);

      const disableButton = new ButtonBuilder()
        .setCustomId(`notify_disable_${userId}`)
        .setLabel('❌ Disable')
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder().addComponents(enableButton, disableButton);

      const currentStatus = user.allow_announcements ? 'Enabled' : 'Disabled';

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🔔 Notification Settings')
        .setDescription('Choose whether you want to receive notifications when you discover rare patterns.')
        .addFields(
          { name: 'Current Status', value: currentStatus, inline: true },
          { name: 'Channel', value: `<#${channelId}>`, inline: true },
          { name: 'Notifications For', value: 'Rare pattern discoveries', inline: false },
          { name: '📝 Note', value: 'Your notifications will be posted in the announcements channel if enabled.', inline: false }
        )
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed],
        components: [row]
      });

    } catch (error) {
      console.error('[Notifications Command] Error:', error);

      const errorEmbed = EmbedHelper.createErrorEmbed(
        'Failed to Update Settings',
        'Could not update notification settings. Please try again.'
      );

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};
