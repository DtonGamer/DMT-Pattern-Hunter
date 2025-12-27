/**
 * Discord Embed Helper
 * Creates formatted Discord embeds for responses
 */

import { EmbedBuilder, inlineCode, codeBlock  } from 'discord.js';

class EmbedHelper {
  static createSuccessEmbed(title, description, fields = []) {
    return new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle(`✅ ${title}`)
      .setDescription(description)
      .addFields(fields)
      .setTimestamp();
  }

  static createErrorEmbed(title, description) {
    return new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle(`❌ ${title}`)
      .setDescription(description)
      .setTimestamp();
  }

  static createInfoEmbed(title, description, fields = []) {
    return new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`ℹ️ ${title}`)
      .setDescription(description)
      .addFields(fields)
      .setTimestamp();
  }

  static createWarningEmbed(title, description) {
    return new EmbedBuilder()
      .setColor('#ffcc00')
      .setTitle(`⚠️ ${title}`)
      .setDescription(description)
      .setTimestamp();
  }

  static createScanEmbed(result, userTier, remainingScans) {
    const emoji = result.statistics.rarity === 'EXTREMELY RARE' ? '💎' :
                   result.statistics.rarity === 'RARE' ? '⭐' :
                   result.statistics.rarity === 'MODERATE' ? '📊' :
                   result.statistics.rarity === 'UNDISCOVERED' ? '🔍' : '📋';

    const tierEmoji = userTier === 'verified' ? '✅' :
                     userTier === 'trusted' ? '🔒' : '👤';

    return new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle(`${emoji} Scan Complete`)
      .setDescription(`Pattern \`${result.pattern}\` in field ${result.field}`)
      .addFields(
        { name: 'Occurrences', value: result.statistics.totalOccurrences.toString(), inline: true },
        { name: 'Frequency', value: `${(result.statistics.frequency * 100).toFixed(2)}%`, inline: true },
        { name: 'Rarity', value: result.statistics.rarity, inline: true },
        { name: 'Volatility', value: result.statistics.volatility, inline: true },
        { name: 'Block Range', value: `${result.startBlock}-${result.endBlock}`, inline: true },
        { name: 'Your Tier', value: `${tierEmoji} ${userTier.toUpperCase()}`, inline: true },
        { name: 'Scans Remaining', value: remainingScans === -1 ? 'Unlimited' : remainingScans.toString(), inline: true }
      )
      .setTimestamp();
  }

  static createDiscoveryEmbed(discovery, index) {
    const medal = index === 1 ? '🥇' : index === 2 ? '🥈' : index === 3 ? '🥉' : `${index}.`;
    const rarityEmoji = discovery.stats?.rarity === 'EXTREMELY RARE' ? '💎' :
                      discovery.stats?.rarity === 'RARE' ? '⭐' :
                      discovery.stats?.rarity === 'MODERATE' ? '📊' :
                      discovery.stats?.rarity === 'UNDISCOVERED' ? '🔍' : '📋';

    return new EmbedBuilder()
      .setColor('#00ccff')
      .setTitle(`${medal} ${rarityEmoji} ${discovery.pattern} in Field ${discovery.field}`)
      .setDescription(`Discovered by: \`${discovery.discoverer}\``)
      .addFields(
        { name: 'Rarity', value: discovery.stats?.rarity || 'Unknown', inline: true },
        { name: 'Frequency', value: `${(discovery.stats?.frequency * 100).toFixed(2)}%`, inline: true },
        { name: 'Discovered', value: new Date(discovery.timestamp).toLocaleString(), inline: true },
        { name: 'Occurrences', value: discovery.stats?.totalOccurrences?.toString() || '0', inline: true }
      )
      .setTimestamp();
  }

  static createLeaderboardEmbed(users, type = 'discoverers') {
    const topUsers = users.slice(0, 10);

    const fields = topUsers.map((user, i) => {
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
      const tierEmoji = user.tier === 'verified' ? '✅' :
                       user.tier === 'trusted' ? '🔒' : '👤';
      const address = user.address || user.discord_id;

      return {
        name: `${medal} ${tierEmoji} ${address.substring(0, 15)}...`,
        value: `Discoveries: ${user.discoveries} | Reputation: ${user.reputation}`,
        inline: false
      };
    });

    return new EmbedBuilder()
      .setColor('#ffd700')
      .setTitle(`🏆 Leaderboard - Top ${type === 'discoverers' ? 'Discoverers' : 'Patterns'}`)
      .setDescription(`Showing top ${Math.min(10, users.length)} of ${users.length} total`)
      .addFields(fields)
      .setTimestamp();
  }

  static createReputationEmbed(user, scanLimit) {
    const tierEmoji = user.tier === 'verified' ? '✅' :
                     user.tier === 'trusted' ? '🔒' : '👤';

    const nextTier = user.tier === 'anonymous' ? 'VERIFIED' :
                    user.tier === 'verified' ? 'TRUSTED' : null;

    const progress = user.tier === 'anonymous' ?
      `${user.discoveries}/10 discoveries` :
      user.tier === 'verified' ?
      `${user.discoveries}/50 discoveries, ${user.verifiedDiscoveries}/20 verified` :
      'Max tier reached';

    return new EmbedBuilder()
      .setColor('#9b59b6')
      .setTitle(`${tierEmoji} User Reputation`)
      .setDescription(`Address: \`${user.address}\``)
      .addFields(
        { name: 'Tier', value: user.tier.toUpperCase(), inline: true },
        { name: 'Reputation', value: user.reputation.toString(), inline: true },
        { name: 'Discoveries', value: user.discoveries.toString(), inline: true },
        { name: 'Verified Discoveries', value: user.verifiedDiscoveries.toString(), inline: true },
        { name: 'Scans Today', value: user.scansToday.toString(), inline: true },
        { name: 'Daily Limit', value: scanLimit === -1 ? 'Unlimited' : scanLimit.toString(), inline: true },
        { name: 'Violations', value: user.violations.toString(), inline: true },
        { name: 'Next Tier', value: nextTier || '✨ MAX', inline: true },
        { name: 'Progress', value: progress, inline: true }
      )
      .setTimestamp();
  }

  static createElementAvailabilityEmbed(check) {
    if (check.available) {
      return new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('✅ Element Available')
        .setDescription(`\`${check.elementId}\` is available for registration!`)
        .addFields(
          { name: 'Source', value: check.source, inline: true },
          { name: 'Status', value: 'Ready to register', inline: true }
        )
        .setTimestamp();
    }

    return new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('❌ Element Unavailable')
      .setDescription(`\`${check.elementId}\` is already registered or reserved`)
      .addFields(
        { name: 'Status', value: check.registered ? 'Registered' : 'Reserved', inline: true },
        { name: 'Owner', value: check.owner || check.reservedBy || 'Unknown', inline: true }
      )
      .setTimestamp();
  }

  static createMyScansEmbed(scans, userTier) {
    if (scans.length === 0) {
      return new EmbedBuilder()
        .setColor('#ffcc00')
        .setTitle('📜 Recent Scans')
        .setDescription('No scans found. Start scanning to discover patterns!')
        .setTimestamp();
    }

    const fields = scans.map((scan, i) => {
      const emoji = scan.rarity === 'EXTREMELY RARE' ? '💎' :
                   scan.rarity === 'RARE' ? '⭐' :
                   scan.rarity === 'MODERATE' ? '📊' :
                   scan.rarity === 'UNDISCOVERED' ? '🔍' : '📋';

      return {
        name: `${i + 1}. ${emoji} "${scan.pattern}" in field ${scan.field}`,
        value: `Blocks: ${scan.start_block}-${scan.end_block}\n` +
               `Occurrences: ${scan.occurrences}\n` +
               `At: ${new Date(scan.timestamp).toLocaleString()}`,
        inline: false
      };
    });

    return new EmbedBuilder()
      .setColor('#00ccff')
      .setTitle('📜 Recent Scans')
      .setDescription(`Showing recent ${scans.length} scans (Tier: ${userTier.toUpperCase()})`)
      .addFields(fields.slice(0, 10))
      .setTimestamp();
  }

  static createRarePatternAnnouncementEmbed(discovery, userId) {
    const isRare = discovery.stats?.rarity === 'RARE' ||
                   discovery.stats?.rarity === 'EXTREMELY RARE';

    if (!isRare) return null;

    const emoji = discovery.stats?.rarity === 'EXTREMELY RARE' ? '💎' : '⭐';

    return new EmbedBuilder()
      .setColor('#ffd700')
      .setTitle(`${emoji} Rare Pattern Discovered!`)
      .setDescription(`<@${userId}> discovered a ${discovery.stats?.rarity} pattern!`)
      .addFields(
        { name: 'Pattern', value: `\`${discovery.pattern}\``, inline: true },
        { name: 'Field', value: discovery.field.toString(), inline: true },
        { name: 'Occurrences', value: discovery.stats?.totalOccurrences?.toString() || '0', inline: true },
        { name: 'Frequency', value: `${(discovery.stats?.frequency * 100).toFixed(3)}%`, inline: true },
        { name: 'Block Range', value: `${discovery.startBlock}-${discovery.endBlock}`, inline: true }
      )
      .setTimestamp();
  }

  static createNewDiscoveryAnnouncementEmbed(discovery, userId) {
    return new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('🎉 New Discovery!')
      .setDescription(`<@${userId}> discovered a new pattern!`)
      .addFields(
        { name: 'Pattern', value: `\`${discovery.pattern}\``, inline: true },
        { name: 'Field', value: discovery.field.toString(), inline: true },
        { name: 'Rarity', value: discovery.stats?.rarity || 'Unknown', inline: true },
        { name: 'Occurrences', value: discovery.stats?.totalOccurrences?.toString() || '0', inline: true },
        { name: 'Discoverer', value: `<@${userId}>`, inline: true }
      )
      .setTimestamp();
  }

  static createReservationEmbed(result) {
    return new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('🎫 Element Reserved')
      .setDescription(`\`${result.elementId}\` reserved for 24 hours`)
      .addFields(
        { name: 'Reserved At', value: new Date(result.reservedAt).toLocaleString(), inline: true },
        { name: 'Expires At', value: new Date(result.expiresAt).toLocaleString(), inline: true },
        { name: 'Next Step', value: 'Use /generate to create registration JSON', inline: false }
      )
      .setTimestamp();
  }

  static createHelpEmbed() {
    return new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('📖 DMT Pattern Hunter Commands')
      .setDescription('All slash commands and their descriptions')
      .addFields(
        { name: '/scan', value: 'Scan for patterns in blockchain data', inline: false },
        { name: '/element', value: 'Check if an element is available', inline: false },
        { name: '/generate', value: 'Generate inscription JSON for elements/deployments/mints', inline: false },
        { name: '/reserve', value: 'Reserve an element for 24 hours', inline: false },
        { name: '/discovery', value: 'View recent pattern discoveries', inline: false },
        { name: '/reputation', value: 'Check your reputation and tier', inline: false },
        { name: '/leaderboard', value: 'View the leaderboard', inline: false },
        { name: '/myscans', value: 'View your recent scan history', inline: false },
        { name: '/names', value: 'Get suggestions for available element names', inline: false },
        { name: '/link', value: 'Link your Bitcoin address to your Discord account', inline: false },
        { name: '/notifications', value: 'Enable/disable rare pattern notifications', inline: false }
      )
      .setTimestamp();
  }
}

export default EmbedHelper;
