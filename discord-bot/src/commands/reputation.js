/**
 * Slash Command - Check User Reputation
 */

import { SlashCommandBuilder  } from 'discord.js';
import EmbedHelper from '../helpers/embed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('reputation')
    .setDescription('Check your reputation and tier'),

  async execute(interaction, contract, db, config) {
    await interaction.deferReply();

    try {
      const userId = interaction.user.id;

      const user = db.getOrCreateUser(userId);
      const bitcoinAddress = user.bitcoin_address || null;

      db.updateLastActive(userId);

      let userReputation;

      if (!contract) {
        // Fallback when contract is unavailable - use basic reputation from DB
        userReputation = {
          address: bitcoinAddress || userId,
          tier: 'anonymous', // Default to anonymous when contract is unavailable
          reputation: 0,
          discoveries: 0,
          verifiedDiscoveries: 0,
          scansToday: db.getScanCountToday(userId),
          violations: 0,
          joinedAt: user.joined_at,
          error: 'Contract unavailable'
        };
      } else if (bitcoinAddress) {
        try {
          userReputation = await contract.getUserReputation(bitcoinAddress);
          // Determine tier based on reputation data
          let tier;
          if (userReputation.totalDiscoveries >= 50 && userReputation.verifiedDiscoveries >= 20) {
            tier = 'trusted';
          } else if (userReputation.totalDiscoveries >= 10) {
            tier = 'verified';
          } else {
            tier = 'anonymous';
          }
          userReputation.tier = tier;
        } catch (error) {
          console.error('[Reputation Command] Error getting reputation from contract:', error);
          // Fallback to basic reputation from DB
          userReputation = {
            address: bitcoinAddress,
            tier: 'anonymous',
            reputation: 0,
            discoveries: 0,
            verifiedDiscoveries: 0,
            scansToday: db.getScanCountToday(userId),
            violations: 0,
            joinedAt: user.joined_at,
            error: 'Unable to fetch reputation data'
          };
        }
      } else {
        userReputation = {
          address: userId,
          tier: 'anonymous',
          reputation: 0,
          discoveries: 0,
          verifiedDiscoveries: 0,
          scansToday: db.getScanCountToday(userId),
          violations: 0,
          joinedAt: user.joined_at
        };
      }

      const scanLimit = config.tiers[userReputation.tier]?.scansPerDay || 5;

      const embed = EmbedHelper.createReputationEmbed(userReputation, scanLimit);

      if (!bitcoinAddress) {
        embed.addFields({
          name: '💡 Tip',
          value: 'Link your Bitcoin address with /link to track discoveries and earn reputation!',
          inline: false
        });
      }

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('[Reputation Command] Error:', error);

      const errorEmbed = EmbedHelper.createErrorEmbed(
        'Failed to Load Reputation',
        'Could not load your reputation data. Please try again.'
      );

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};
