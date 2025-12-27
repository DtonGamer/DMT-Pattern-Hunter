/**
 * Slash Command - Reserve Element
 */

import { SlashCommandBuilder  } from 'discord.js';
import EmbedHelper from '../helpers/embed.js';
import PermissionHelper from '../helpers/permissions.js';

export default {
  data: new SlashCommandBuilder()
    .setName('reserve')
    .setDescription('Reserve an element for 24 hours')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Element name')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('pattern')
        .setDescription('Pattern')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('field')
        .setDescription('Field number (0-37)')
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(37)),

  async execute(interaction, contract, db, config) {
    await interaction.deferReply();

    try {
      const userId = interaction.user.id;
      const member = await interaction.guild.members.fetch(userId);

      const tier = PermissionHelper.getUserTier(member, config);

      if (!PermissionHelper.hasPermission(tier, 'reserve', config)) {
        const errorEmbed = EmbedHelper.createErrorEmbed(
          'Permission Denied',
          'You need VERIFIED or TRUSTED tier to reserve elements.\n\n' +
          'Upgrade: Make 10 discoveries to become VERIFIED.'
        );
        return await interaction.editReply({ embeds: [errorEmbed] });
      }

      db.updateLastActive(userId);

      const name = interaction.options.getString('name');
      const pattern = interaction.options.getString('pattern');
      const field = interaction.options.getInteger('field') || 16;

      const bitcoinAddress = await contract.features.elementRegistry.getUserAddress(userId);

      if (!bitcoinAddress) {
        const user = db.getUser(userId);
        if (user && user.bitcoin_address) {
          bitcoinAddress = user.bitcoin_address;
        } else {
          bitcoinAddress = `${userId}`;
        }
      }

      const result = await contract.reserveElement(name, pattern, field, bitcoinAddress);

      const expiresAt = Date.now() + (24 * 60 * 60 * 1000);

      db.addReservation(userId, name, pattern, field, expiresAt);

      const embed = EmbedHelper.createReservationEmbed({
        elementId: `${name}.${pattern}.${field}.element`,
        reservedAt: Date.now(),
        expiresAt: expiresAt
      });

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('[Reserve Command] Error:', error);

      const errorEmbed = EmbedHelper.createErrorEmbed(
        'Reservation Failed',
        error.message || 'Failed to reserve element. Please try again.'
      );

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};
