/**
 * Slash Command - Generate Inscription JSON
 */

import { SlashCommandBuilder  } from 'discord.js';
import EmbedHelper from '../helpers/embed.js';
import PermissionHelper from '../helpers/permissions.js';

export default {
  data: new SlashCommandBuilder()
    .setName('generate')
    .setDescription('Generate inscription JSON for elements, deployments, or mints')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Type of JSON to generate')
        .setRequired(true)
        .addChoices(
          { name: 'element-registration', value: 'element' },
          { name: 'nat-deployment', value: 'deploy' },
          { name: 'nat-mint', value: 'mint' }
        ))
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Element name (for element-registration)')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('pattern')
        .setDescription('Pattern (for element-registration)')
        .setRequired(false))
    .addIntegerOption(option =>
      option.setName('field')
        .setDescription('Field number (for element-registration)')
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(37))
    .addStringOption(option =>
      option.setName('ticker')
        .setDescription('Token ticker (1-32 chars, for deploy/mint)')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('elem')
        .setDescription('Element (format: name.pattern.field.element, for deploy)')
        .setRequired(false))
    .addIntegerOption(option =>
      option.setName('supply')
        .setDescription('Max supply (optional, for deploy)')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('deployment_id')
        .setDescription('Deployment inscription ID (for mint)')
        .setRequired(false))
    .addIntegerOption(option =>
      option.setName('block')
        .setDescription('Block number (for mint)')
        .setRequired(false)),

  async execute(interaction, contract, db, config) {
    await interaction.deferReply();

    try {
      const userId = interaction.user.id;
      const member = await interaction.guild.members.fetch(userId);

      const tier = PermissionHelper.getUserTier(member, config);

      if (!PermissionHelper.hasPermission(tier, 'generate', config)) {
        const errorEmbed = EmbedHelper.createErrorEmbed(
          'Permission Denied',
          'You need VERIFIED or TRUSTED tier to generate inscription JSON.\n\n' +
          'Upgrade: Make 10 discoveries to become VERIFIED.'
        );
        return await interaction.editReply({ embeds: [errorEmbed] });
      }

      db.updateLastActive(userId);

      const type = interaction.options.getString('type');

      let result;
      let output;

      if (type === 'element') {
        const name = interaction.options.getString('name');
        const pattern = interaction.options.getString('pattern');
        const field = interaction.options.getInteger('field');

        if (!name || !pattern || field === null) {
          const errorEmbed = EmbedHelper.createErrorEmbed(
            'Missing Parameters',
            'For element-registration, you need: name, pattern, and field'
          );
          return await interaction.editReply({ embeds: [errorEmbed] });
        }

        result = await contract.generateElementRegistration(name, pattern, field);
        output = JSON.stringify(result.inscription, null, 2);

      } else if (type === 'deploy') {
        const ticker = interaction.options.getString('ticker');
        const elem = interaction.options.getString('elem');
        const supply = interaction.options.getInteger('supply');

        if (!ticker || !elem) {
          const errorEmbed = EmbedHelper.createErrorEmbed(
            'Missing Parameters',
            'For nat-deployment, you need: ticker and elem'
          );
          return await interaction.editReply({ embeds: [errorEmbed] });
        }

        result = await contract.generateDeployment(ticker, elem, supply || null, null);
        output = JSON.stringify(result.inscription, null, 2);

      } else if (type === 'mint') {
        const deploymentId = interaction.options.getString('deployment_id');
        const ticker = interaction.options.getString('ticker');
        const block = interaction.options.getInteger('block');

        if (!deploymentId || !ticker || block === null) {
          const errorEmbed = EmbedHelper.createErrorEmbed(
            'Missing Parameters',
            'For nat-mint, you need: deployment_id, ticker, and block'
          );
          return await interaction.editReply({ embeds: [errorEmbed] });
        }

        result = await contract.generateMint(deploymentId, ticker, block);
        output = JSON.stringify(result.inscription, null, 2);
      }

      const successEmbed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('✅ Inscription JSON Generated')
        .setDescription(`Type: ${type.toUpperCase()}`)
        .addFields({
          name: '📋 JSON',
          value: `\`\`\`json\n${output.substring(0, 1000)}${output.length > 1000 ? '\n... (truncated)' : ''}\n\`\`\``,
          inline: false
        })
        .setTimestamp();

      await interaction.editReply({ embeds: [successEmbed] });

    } catch (error) {
      console.error('[Generate Command] Error:', error);

      const errorEmbed = EmbedHelper.createErrorEmbed(
        'Generation Failed',
        error.message || 'Failed to generate inscription JSON. Please try again.'
      );

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};
