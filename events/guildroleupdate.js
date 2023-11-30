const { Client, Events, GatewayIntentBits, Guilds, EmbedBuilder, MessageManager, Embed, Collection, GuildMember, GuildHubType, AuditLogEvent, Permissions } = require('discord.js');
const config = require('../config.json');
const fs = require('fs');
const path = require('path');

// Load existing guild settings from the JSON file
const guildSettingsFile = path.resolve(__dirname, '..', 'guildSettings.json');
let guildSettings = {};
try {
  const data = fs.readFileSync(guildSettingsFile, 'utf8');
  guildSettings = JSON.parse(data);
} catch (err) {
  console.error('Error reading guild settings file:', err.message);
}

module.exports = {
  name: Events.GuildRoleUpdate,
  on: true,
  execute: async (oldRole, newRole) => {

    oldRole.guild.fetchAuditLogs({
      type: AuditLogEvent.GuildRoleUpdate,
    }).then(async audit => {

      const { executor } = audit.entries.first();
      const executorAvatarURL = executor.avatarURL();

      const guildID = oldRole.guild.id;
      const recChannelID = guildSettings[guildID];

      if (!recChannelID) return; // No logging channel registered for this guild

      const recChannel = oldRole.guild.channels.cache.get(recChannelID);
      if (!recChannel || !recChannel.isTextBased()) {
        return oldRole.channel.send('Invalid logging channel. Please provide a valid text channel ID.');
      }

      const roleUpdateEmbed = new EmbedBuilder()
        .setColor('#b00b1e')
        .setTitle('Role Updated')
        .setDescription(`Role updated by ${executor}`)
        .setAuthor({ name: `${executor.tag}`, iconURL: executorAvatarURL });

      // Name Update
      if (oldRole.name !== newRole.name) {
        roleUpdateEmbed.setTitle('Role Name Update')
        roleUpdateEmbed.addFields({ name: 'Old Name', value: `${oldRole.name} — <@&${oldRole.id}>`, inline: false })
          .addFields({ name: 'New Name', value: `${newRole.name} — <@&${newRole.id}>`, inline: false });
      }

      // Color Update
      if (oldRole.hexColor !== newRole.hexColor) {
        roleUpdateEmbed.setTitle('Role Colour Updated')
        roleUpdateEmbed.addFields({ name: `Role:`, value: `${newRole.name} — <@&${newRole.id}>`})
        roleUpdateEmbed.addFields({ name: 'Old Color', value: `${oldRole.hexColor}`, inline: false })
          .addFields({ name: 'New Color', value: `${newRole.hexColor}`, inline: false });
      }

      // Permissions Update
      if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
        roleUpdateEmbed.addFields({ name: 'Permissions Updated', value: `The permissions for <@&${oldRole.id}> have been updated.`, inline: false });
      }

      // Position Update
      if (oldRole.position !== newRole.position) {
        return;
      }

      roleUpdateEmbed.setTimestamp()
        .setFooter({ text: 'Courtesy of Alacritas', iconURL: 'https://file.coffee/u/L8g-XrVmTvbOI_XwAnWt6.png' });

      recChannel.send({ embeds: [roleUpdateEmbed] });
    })
  }
};
