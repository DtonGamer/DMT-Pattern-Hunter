/**
 * Slash Command - Scan for Pattern
 */

import { SlashCommandBuilder, EmbedBuilder  } from 'discord.js';
import EmbedHelper from '../helpers/embed.js';
import PermissionHelper from '../helpers/permissions.js';

export default {
  data: new SlashCommandBuilder()
    .setName('scan')
    .setDescription('Scan for patterns in blockchain data')
    .addStringOption(option =>
      option.setName('pattern')
        .setDescription('Pattern to search (e.g., "69", "420", "777")')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('field')
        .setDescription('Block field to search (0-37)')
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(37))
    .addIntegerOption(option =>
      option.setName('start_block')
        .setDescription('Starting block height')
        .setRequired(false))
    .addIntegerOption(option =>
      option.setName('end_block')
        .setDescription('Ending block height')
        .setRequired(false)),

  async execute(interaction, contract, db, config) {
    await interaction.deferReply();

    try {
      const pattern = interaction.options.getString('pattern');
      const field = interaction.options.getInteger('field') || 16;
      let startBlock = interaction.options.getInteger('start_block') || 800000;
      let endBlock = interaction.options.getInteger('end_block') || 800050;

      const userId = interaction.user.id;
      const user = db.getOrCreateUser(userId);
      const member = await interaction.guild.members.fetch(userId);

      const tier = PermissionHelper.getUserTier(member, config);

      db.updateLastActive(userId);

      const scanLimit = PermissionHelper.getScanLimit(tier, config);

      if (scanLimit !== -1) {
        const scansToday = db.getScanCountToday(userId);

        if (scansToday >= scanLimit) {
          const tierNames = { anonymous: 'BASIC', verified: 'VERIFIED', trusted: 'TRUSTED' };

          const errorEmbed = EmbedHelper.createErrorEmbed(
            'Daily Limit Reached',
            `You've used all ${scanLimit} scans today.\n\n` +
            `**Current Tier:** ${tierNames[tier]}\n` +
            `**Upgrades:**\n` +
            `- BASIC → VERIFIED: 10 discoveries\n` +
            `- VERIFIED → TRUSTED: 50 discoveries + 20 verified\n\n` +
            `Use /link to connect your Bitcoin address and track discoveries!`
          );

          return await interaction.editReply({ embeds: [errorEmbed] });
        }
      }

      const bitcoinAddress = user.bitcoin_address || `${userId}`;
      const isLinked = !!user.bitcoin_address;

      const result = await contract.scanPattern(
        pattern,
        field,
        startBlock,
        endBlock,
        bitcoinAddress
      );

      db.addScanRecord(
        userId,
        pattern,
        field,
        startBlock,
        endBlock,
        result.statistics.totalOccurrences,
        result.statistics.rarity
      );

      const scansLeft = scanLimit === -1 ? -1 : scanLimit - (db.getScanCountToday(userId));
      const scanEmbed = EmbedHelper.createScanEmbed(result, tier, scansLeft);

      if (!isLinked) {
        scanEmbed.addFields({
          name: '💡 Tip',
          value: 'Link your Bitcoin address with /link to track discoveries and upgrade your tier!',
          inline: false
        });
      }

      await interaction.editReply({ embeds: [scanEmbed] });

      if (result.statistics.totalOccurrences > 0) {
        const isRare = result.statistics.rarity === 'RARE' ||
                       result.statistics.rarity === 'EXTREMELY RARE';

        if (isRare && user.allow_announcements && config.channels.announcements) {
          const announcementChannel = await interaction.client.channels.fetch(config.channels.announcements);
          if (announcementChannel) {
            const rareEmbed = EmbedHelper.createRarePatternAnnouncementEmbed(result, userId);
            if (rareEmbed) {
              await announcementChannel.send({ embeds: [rareEmbed] });
            }
          }
        }

        if (user.allow_announcements && config.channels.announcements) {
          const announcementChannel = await interaction.client.channels.fetch(config.channels.announcements);
          if (announcementChannel) {
            const newDiscoveryEmbed = EmbedHelper.createNewDiscoveryAnnouncementEmbed(result, userId);
            await announcementChannel.send({ embeds: [newDiscoveryEmbed] });
          }
        }
      } else if (result.statistics.rarity === 'UNDISCOVERED' && user.allow_announcements && config.channels.announcements) {
        const announcementChannel = await interaction.client.channels.fetch(config.channels.announcements);
        if (announcementChannel) {
          const newDiscoveryEmbed = EmbedHelper.createNewDiscoveryAnnouncementEmbed(result, userId);
          await announcementChannel.send({ embeds: [newDiscoveryEmbed] });
        }
      }

    } catch (error) {
      console.error('[Scan Command] Error:', error);

      const errorEmbed = EmbedHelper.createErrorEmbed(
        'Scan Failed',
        error.message.includes('limit') ? error.message : 'Failed to scan for pattern. Please try again.'
      );

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};
