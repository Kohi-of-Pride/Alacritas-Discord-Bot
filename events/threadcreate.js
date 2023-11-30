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
  name: Events.ThreadCreate,
  on: true,
  execute: async thread => {
    thread.guild.fetchAuditLogs({
      type: AuditLogEvent.ThreadCreate,
    }).then(async audit => {
      const { executor } = audit.entries.first();

      const guildID = thread.guild.id;
      const recChannelID = guildSettings[guildID];

      if (!recChannelID) return; // No logging channel registered for this guild

      const recChannel = thread.guild.channels.cache.get(recChannelID);
      if (!recChannel || !recChannel.isTextBased()) {
        return thread.channel.send('Invalid logging channel. Please provide a valid text channel ID.');
      }

      const parentChannel = thread.parent;

      const threadCreateEmbed = new EmbedBuilder()
        .setColor('#b00b1e')
        .setTitle('Thread Created')
        .setDescription(`Thread Created by ${executor}`)
        .addFields({ name: 'Thread', value: `${thread.name}`, inline: false })
        .addFields({ name: 'Parent Channel', value: `${parentChannel.name} - <#${parentChannel.id}>`, inline: false })
        .setTimestamp()
        .setFooter({ text: 'Courtesy of Alacritas', iconURL: 'https://file.coffee/u/L8g-XrVmTvbOI_XwAnWt6.png' });

      recChannel.send({ embeds: [threadCreateEmbed] });
    });
  },
};
