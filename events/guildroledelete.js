const { Client, Events, GatewayIntentBits, Guilds, EmbedBuilder, MessageManager, Embed, Collection, GuildMember, GuildHubType, AuditLogEvent } = require('discord.js');
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
  name: Events.GuildRoleDelete,
  on: true,
  execute: async role => {

    role.guild.fetchAuditLogs({
      type: AuditLogEvent.GuildRoleDelete,
    }).then(async audit => {

      const { executor } = audit.entries.first()


      const name = role.name;
      const id = role.id;
      const color = role.hexColor;
      const createdAt = role.createdAt;
      const position = role.position;
      const mention = role.mentionable;

      const guildID = role.guild.id;
      const recChannelID = guildSettings[guildID];

      if (!recChannelID) return; // No logging channel registered for this guild

      const recChannel = role.guild.channels.cache.get(recChannelID);
      if (!recChannel || !recChannel.isTextBased()) {
        return role.channel.send('Invalid logging channel. Please provide a valid text channel ID.');
      }

      const roleDEmbed = new EmbedBuilder()
        .setColor('#b00b1e')
        .setTitle('Role Deleted')
        .setDescription(`Role Deleted by ${executor}`)
        .addFields({ name: 'Name:', value: `${name}`, inline: false })
        .addFields({ name: 'ID:', value: `${id}`, inline: false })
        .addFields({ name: 'Color:', value: `${color}`, inline: false })
        .addFields({ name: 'Mentionable:', value: `${mention}`, inline: false })
        .addFields({ name: 'Position:', value: `${position}`, inline: false })
        .setTimestamp()
        .setFooter({ text: 'Courtesy of Alacritas', iconURL: 'https://file.coffee/u/L8g-XrVmTvbOI_XwAnWt6.png' });

      recChannel.send({ embeds: [roleDEmbed] });
    })
  }
};