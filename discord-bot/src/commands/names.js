/**
 * Slash Command - Get Available Element Name Suggestions
 */

import { SlashCommandBuilder  } from 'discord.js';
import EmbedHelper from '../helpers/embed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('names')
    .setDescription('Get suggestions for available element names')
    .addStringOption(option =>
      option.setName('pattern')
        .setDescription('Pattern to check')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('field')
        .setDescription('Field number (0-37)')
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(37)),

  async execute(interaction, contract, db) {
    await interaction.deferReply();

    try {
      const pattern = interaction.options.getString('pattern');
      const field = interaction.options.getInteger('field') || 16;
      const userId = interaction.user.id;

      db.updateLastActive(userId);

      const suggestions = await contract.features.elementRegistry.suggestAvailableNames(
        pattern,
        field
      );

      if (suggestions.length === 0) {
        const infoEmbed = EmbedHelper.createInfoEmbed(
          'No Suggestions',
          `No available names found for pattern "${pattern}" in field ${field}.\n\n` +
          'Try a different pattern or field!'
        );
        return await interaction.editReply({ embeds: [infoEmbed] });
      }

      const fields = suggestions.slice(0, 20).map((suggestion, i) => ({
        name: `${i + 1}. ${suggestion.name}`,
        value: `\`${suggestion.name}.${pattern}.${field}.element\``,
        inline: false
      }));

      const embed = new EmbedBuilder()
        .setColor('#00ccff')
        .setTitle('💡 Available Element Names')
        .setDescription(`Found ${suggestions.length} available names for pattern "${pattern}" in field ${field}`)
        .addFields(fields)
        .setFooter({ text: `Showing ${Math.min(20, suggestions.length)} of ${suggestions.length} suggestions` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('[Names Command] Error:', error);

      const errorEmbed = EmbedHelper.createErrorEmbed(
        'Failed to Get Suggestions',
        'Could not load name suggestions. Please try again.'
      );

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};
