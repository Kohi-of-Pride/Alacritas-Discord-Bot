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
  name: Events.ChannelUpdate,
  on: true,
  execute: async (oldChannel, newChannel) => {
    newChannel.guild.fetchAuditLogs({
      type: AuditLogEvent.ChannelUpdate,
    }).then(async audit => {

      const { executor } = audit.entries.first();

      const guildID = newChannel.guild.id;
      const recChannelID = guildSettings[guildID];

      if (!recChannelID) return; // No logging channel registered for this guild

      const recChannel = newChannel.guild.channels.cache.get(recChannelID);
      if (!recChannel || !recChannel.isTextBased()) {
        return newChannel.send('Invalid logging channel. Please provide a valid text channel ID.');
      }

      if(oldChannel.position !== newChannel.position || oldChannel.rawPosition !== newChannel.rawPosition) {
        return;
      } else {
      const channelUpdateEmbed = new EmbedBuilder()
        .setColor('#b00b1e')
        .setTitle('Channel Updated')
        .setDescription(`Channel updated by ${executor}`)
        .addFields({ name: 'Updated Channel', value: `<#${newChannel.id}>`, inline: false });

      // Name Update
      if (oldChannel.name !== newChannel.name) {
        channelUpdateEmbed.addFields({ name: 'Old Name', value: `${oldChannel.name}`, inline: false });
        channelUpdateEmbed.addFields({ name: 'New Name', value: `${newChannel.name}`, inline: false });
      }

      if(oldChannel.topic == null) {
        oldChannel.topic = 'The channel had no topic.'
        } 
      if (newChannel.topic == null) {
        newChannel.topic = 'The channel has no topic.'
      }
      // Topic Update
      if (oldChannel.topic !== newChannel.topic) {
        channelUpdateEmbed.addFields({ name: 'Topic Update', value: `Old Topic: ${oldChannel.topic}\nNew Topic: ${newChannel.topic}`, inline: false });
      }

      // Channel Type Update
      if (oldChannel.type !== newChannel.type) {
        channelUpdateEmbed.addFields({ name: 'Channel Type Update', value: `Old Type: ${oldChannel.type}\nNew Type: ${newChannel.type}`, inline: false });
      }

      channelUpdateEmbed.setTimestamp()
        .setFooter({ text: 'Courtesy of Alacritas', iconURL: 'https://file.coffee/u/L8g-XrVmTvbOI_XwAnWt6.png' });

      recChannel.send({ embeds: [channelUpdateEmbed] });
      }
    })
  }
};
