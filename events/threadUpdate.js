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
  name: Events.ThreadUpdate,
  on: true,
  execute: async (oldThread, newThread) => {
    oldThread.guild.fetchAuditLogs({
      type: AuditLogEvent.ThreadUpdate,
    }).then(async audit => {
      const { executor } = audit.entries.first();

      const guildID = oldThread.guild.id;
      const recChannelID = guildSettings[guildID];

      if (!recChannelID) return; // No logging channel registered for this guild

      const recChannel = oldThread.guild.channels.cache.get(recChannelID);
      if (!recChannel || !recChannel.isTextBased()) {
        return oldThread.channel.send('Invalid logging channel. Please provide a valid text channel ID.');
      }

      const parentChannel = oldThread.parent;
      
      const threadUpdateEmbed = new EmbedBuilder()
        .setColor('#b00b1e')
        .setTitle('Thread Updated')
        .setDescription(`Thread Updated by ${executor}`)
        .addFields({ name: 'Old Thread', value: `${oldThread.name}`, inline: false })
        .addFields({ name: 'New Thread', value: `${newThread.name}`, inline: false })
        .addFields({ name: 'Parent Channel', value: `${parentChannel.name} - <#${parentChannel.id}>`, inline: false })
        .setTimestamp()
        .setFooter({ text: 'Courtesy of Alacritas', iconURL: 'https://file.coffee/u/L8g-XrVmTvbOI_XwAnWt6.png' });

      recChannel.send({ embeds: [threadUpdateEmbed] });
    });
  },
};
