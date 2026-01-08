
/**
 * Slash Command - Check User Reputation
 */

import { SlashCommandBuilder } from 'discord.js';
import EmbedHelper from '../helpers/embed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('reputation')
    .setDescription('Check your reputation and tier'),

  async execute(interaction, contract, db, config) {
    // IMMEDIATE defer - must happen first
    try {
      await interaction.deferReply();
    } catch (error) {
      console.error('[Reputation] Failed to defer reply:', error);
      return;
    }

    try {
      // CRITICAL: Validate config first
      if (!config || !config.tiers) {
        console.error('[Reputation Command] Config missing. Received:', {
          hasConfig: !!config,
          configKeys: config ? Object.keys(config) : 'none',
          hasTiers: !!config?.tiers
        });
        
        return interaction.editReply({
          content: '❌ Bot configuration error. Config or tiers missing. Please contact an administrator.'
        });
      }

      const userId = interaction.user.id;
      const user = db.getOrCreateUser(userId);
      const bitcoinAddress = user.bitcoin_address || null;

      db.updateLastActive(userId);

      let userReputation;

      if (!contract) {
        // Fallback when contract is unavailable
        userReputation = {
          address: bitcoinAddress || userId,
          tier: 'anonymous',
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

          // Normalize field names (contract might use different names)
          userReputation.discoveries = userReputation.discoveries || userReputation.totalDiscoveries || 0;
          userReputation.verifiedDiscoveries = userReputation.verifiedDiscoveries || 0;
          userReputation.reputation = userReputation.reputation || 0;
          userReputation.violations = userReputation.violations || 0;

          // Determine tier based on config thresholds
          const verifiedReq = config.tiers.verified?.upgradeRequirement?.discoveries || 10;
          const trustedReq = config.tiers.trusted?.upgradeRequirement?.discoveries || 50;
          const trustedVerifiedReq = config.tiers.trusted?.upgradeRequirement?.verifiedDiscoveries || 20;

          let tier = 'anonymous';
          if (userReputation.discoveries >= trustedReq && userReputation.verifiedDiscoveries >= trustedVerifiedReq) {
            tier = 'trusted';
          } else if (userReputation.discoveries >= verifiedReq) {
            tier = 'verified';
          }
          
          userReputation.tier = tier;
          userReputation.scansToday = db.getScanCountToday(userId);
          userReputation.address = bitcoinAddress;
        } catch (error) {
          console.error('[Reputation Command] Error getting reputation from contract:', error);
          // Fallback to basic reputation
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
        // No Bitcoin address linked
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

      // Get scan limit from config
      const tierConfig = config.tiers[userReputation.tier];
      if (!tierConfig) {
        console.error('[Reputation Command] Tier config not found for tier:', userReputation.tier);
        console.error('[Reputation Command] Available tiers:', Object.keys(config.tiers));
        
        return interaction.editReply({
          content: `❌ Invalid tier configuration for tier: ${userReputation.tier}. Please contact an administrator.`
        });
      }

      const scanLimit = tierConfig.scansPerDay || 5;

      // Create embed
      const embed = EmbedHelper.createReputationEmbed(userReputation, scanLimit);

      // Add tip if no Bitcoin address
      if (!bitcoinAddress) {
        embed.addFields({
          name: '💡 Tip',
          value: 'Link your Bitcoin address with `/link` to track discoveries and earn reputation!',
          inline: false
        });
      }

      // Add tier progression info
      const verifiedReq = config.tiers.verified?.upgradeRequirement?.discoveries || 10;
      const trustedReq = config.tiers.trusted?.upgradeRequirement?.discoveries || 50;
      const trustedVerifiedReq = config.tiers.trusted?.upgradeRequirement?.verifiedDiscoveries || 20;

      if (userReputation.tier === 'anonymous' && userReputation.discoveries < verifiedReq) {
        const remaining = verifiedReq - userReputation.discoveries;
        embed.addFields({
          name: '📈 Next Tier: Verified',
          value: `Make ${remaining} more ${remaining === 1 ? 'discovery' : 'discoveries'} to unlock Verified tier (${config.tiers.verified.scansPerDay} scans/day)`,
          inline: false
        });
      } else if (userReputation.tier === 'verified') {
        const remainingTotal = Math.max(0, trustedReq - userReputation.discoveries);
        const remainingVerified = Math.max(0, trustedVerifiedReq - userReputation.verifiedDiscoveries);
        if (remainingTotal > 0 || remainingVerified > 0) {
          embed.addFields({
            name: '📈 Next Tier: Trusted',
            value: `Need ${remainingTotal} more total discoveries and ${remainingVerified} more verified discoveries to unlock Trusted tier (${config.tiers.trusted.scansPerDay} scans/day)`,
            inline: false
          });
        }
      }

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('[Reputation Command] Error:', error);

      try {
        const errorEmbed = EmbedHelper.createErrorEmbed(
          'Failed to Load Reputation',
          'Could not load your reputation data. Please try again.'
        );

        await interaction.editReply({ embeds: [errorEmbed] });
      } catch (replyError) {
        console.error('[Reputation Command] Failed to send error message:', replyError);
      }
    }
  }
};