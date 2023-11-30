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
  name: Events.GuildEmojiCreate,
  on: true,
  execute: async emoji => {
    emoji.guild.fetchAuditLogs({
      type: AuditLogEvent.GuildEmojiCreate,
    }).then(async audit => {

      const { executor } = audit.entries.first()

      const name = emoji.name;
      const id = emoji.id;
      const url = emoji.url;
      const animated = emoji.animated;
      const createdat = emoji.createdAt;

      const guildID = emoji.guild.id;
      const recChannelID = guildSettings[guildID];

      if (!recChannelID) return; // No logging channel registered for this guild

      const recChannel = emoji.guild.channels.cache.get(recChannelID);
      if (!recChannel || !recChannel.isTextBased()) {
        return emoji.channel.send('Invalid logging channel. Please provide a valid text channel ID.');
      }

      const emojiCEmbed = new EmbedBuilder()
        .setColor('#b00b1e')
        .setTitle('Emoji Added')
        .setDescription(`Emoji added by ${executor}`)
        .setThumbnail(url)
        .addFields({ name: 'Emoji Name', value: `${name} - <:${name}:${id}>`, inline: false })
        .addFields({ name: 'Emoji URL', value: `${url}`, inline: false })
        .addFields({ name: 'Animated:', value: `${animated}`, inline: false })
        .addFields({ name: 'Creation Time', value: `${createdat}`, inline: false })
        .setTimestamp()
        .setFooter({ text: 'Courtesy of Alacritas', iconURL: 'https://file.coffee/u/L8g-XrVmTvbOI_XwAnWt6.png' });

      recChannel.send({ embeds: [emojiCEmbed] });
    })
  }
};