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
  name: Events.ChannelCreate,
  on: true,
  execute: async channel => {
    channel.guild.fetchAuditLogs({
      type: AuditLogEvent.ChannelCreate,
    }).then(async audit => {

      const guildID = channel.guild.id;
      const recChannelID = guildSettings[guildID];

      if (!recChannelID) return; // No logging channel registered for this guild

      const recChannel = channel.guild.channels.cache.get(recChannelID);
      if (!recChannel || !recChannel.isTextBased()) {
        return channel.channel.send('Invalid logging channel. Please provide a valid text channel ID.');
      }

      const { executor } = audit.entries.first()

      const name = channel.name;
      const id = channel.id;
      const topic = channel.topic;
      let type = channel.type;

      if (type == 0) type = 'Text'
      if (type == 2) type = 'Voice'
      if (type == 13) type = 'Stage'
      if (type == 15) type = 'Form'
      if (type == 5) type = 'Announcement'
      if (type == 5) type = 'Category'



      const channelCEmbed = new EmbedBuilder()
        .setColor('#b00b1e')
        .setTitle('Channel Created')
        .setDescription(`Channel created by ${executor}`)
        .addFields({ name: 'Channel Name', value: `${name} - <#${id}>`, inline: false })
        .addFields({ name: 'Channel Type', value: `${type}`, inline: false })
        .setTimestamp()
        .setFooter({ text: 'Courtesy of Alacritas', iconURL: 'https://file.coffee/u/L8g-XrVmTvbOI_XwAnWt6.png' });

      recChannel.send({ embeds: [channelCEmbed] });
    })
  }
}